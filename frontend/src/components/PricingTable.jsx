import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export const PricingTable = ({ items, caption, note }) => {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Service</TableHead>
            <TableHead className="w-[40%]">Description</TableHead>
            <TableHead className="text-right w-[20%]">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index} data-testid={`pricing-row-${index}`}>
              <TableCell className="font-medium">{item.service}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{item.description}</TableCell>
              <TableCell className="text-right font-semibold">{item.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {note && (
        <div className="px-4 py-3 bg-muted/50 border-t">
          <p className="text-sm text-muted-foreground italic">{note}</p>
        </div>
      )}
    </div>
  );
};