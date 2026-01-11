import { Table } from "@medusajs/ui"

// Skeleton cart item with gold shimmer animation - L-skeleton b l-shimmer dhabi
const SkeletonCartItem = () => {
  return (
    <Table.Row className="w-full m-4">
      <Table.Cell className="!pl-0 p-4 w-24">
        <div className="flex w-24 h-24 p-4 bg-gradient-to-r from-[#f0e4cc] via-[#d4af37]/20 to-[#f0e4cc] rounded-lg animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
      </Table.Cell>
      <Table.Cell className="text-left">
        <div className="flex flex-col gap-y-2">
          <div className="w-32 h-4 bg-gradient-to-r from-[#f0e4cc] via-[#d4af37]/20 to-[#f0e4cc] rounded animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
          <div className="w-24 h-4 bg-gradient-to-r from-[#f0e4cc] via-[#d4af37]/20 to-[#f0e4cc] rounded animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className="flex gap-2 items-center">
          <div className="w-6 h-8 bg-gradient-to-r from-[#f0e4cc] via-[#d4af37]/20 to-[#f0e4cc] rounded animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
          <div className="w-14 h-10 bg-gradient-to-r from-[#f0e4cc] via-[#d4af37]/20 to-[#f0e4cc] rounded animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className="flex gap-2">
          <div className="w-12 h-6 bg-gradient-to-r from-[#f0e4cc] via-[#d4af37]/20 to-[#f0e4cc] rounded animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
        </div>
      </Table.Cell>
      <Table.Cell className="!pr-0 text-right">
        <div className="flex gap-2 justify-end">
          <div className="w-12 h-6 bg-gradient-to-r from-[#f0e4cc] via-[#d4af37]/20 to-[#f0e4cc] rounded animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
        </div>
      </Table.Cell>
    </Table.Row>
  )
}

export default SkeletonCartItem
