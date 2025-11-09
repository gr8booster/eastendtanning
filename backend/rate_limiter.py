"""
Simple in-memory rate limiter for API endpoints
Uses a sliding window approach with dict-based storage
"""
from fastapi import HTTPException, Request
from typing import Dict, Tuple
from datetime import datetime, timedelta
from functools import wraps
import time

# In-memory storage: {key: (request_count, window_start_time)}
_rate_limit_storage: Dict[str, Tuple[int, float]] = {}

def rate_limit(max_requests: int = 10, window_seconds: int = 60):
    """
    Rate limiter decorator for FastAPI endpoints
    
    Args:
        max_requests: Maximum number of requests allowed in the window
        window_seconds: Time window in seconds
    
    Usage:
        @rate_limit(max_requests=5, window_seconds=60)
        @app.post("/api/endpoint")
        async def my_endpoint(request: Request):
            ...
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            # Get client identifier (IP address or user ID if authenticated)
            client_ip = request.client.host if request.client else "unknown"
            endpoint = request.url.path
            rate_key = f"{endpoint}:{client_ip}"
            
            now = time.time()
            
            # Clean up old entries (older than 1 hour)
            cleanup_threshold = now - 3600
            keys_to_delete = [
                k for k, (_, start_time) in _rate_limit_storage.items()
                if start_time < cleanup_threshold
            ]
            for k in keys_to_delete:
                del _rate_limit_storage[k]
            
            # Check rate limit
            if rate_key in _rate_limit_storage:
                count, window_start = _rate_limit_storage[rate_key]
                
                # If window has expired, reset
                if now - window_start > window_seconds:
                    _rate_limit_storage[rate_key] = (1, now)
                else:
                    # Still within window
                    if count >= max_requests:
                        retry_after = int(window_seconds - (now - window_start))
                        raise HTTPException(
                            status_code=429,
                            detail=f"Rate limit exceeded. Try again in {retry_after} seconds.",
                            headers={"Retry-After": str(retry_after)}
                        )
                    _rate_limit_storage[rate_key] = (count + 1, window_start)
            else:
                # First request in window
                _rate_limit_storage[rate_key] = (1, now)
            
            # Call the actual endpoint
            return await func(request, *args, **kwargs)
        
        return wrapper
    return decorator


def get_rate_limit_status(endpoint: str, client_ip: str) -> Dict:
    """
    Get current rate limit status for debugging
    
    Returns:
        {
            "requests_made": int,
            "requests_remaining": int,
            "window_start": float,
            "resets_in_seconds": int
        }
    """
    rate_key = f"{endpoint}:{client_ip}"
    
    if rate_key not in _rate_limit_storage:
        return {
            "requests_made": 0,
            "requests_remaining": 10,  # default
            "window_start": time.time(),
            "resets_in_seconds": 60  # default
        }
    
    count, window_start = _rate_limit_storage[rate_key]
    now = time.time()
    window_seconds = 60  # default
    
    return {
        "requests_made": count,
        "requests_remaining": max(0, 10 - count),
        "window_start": window_start,
        "resets_in_seconds": int(max(0, window_seconds - (now - window_start)))
    }
