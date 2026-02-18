import { Category } from '@/types/expense'
import { CATEGORY_COLORS } from '@/lib/utils'

interface BadgeProps {
    category: Category
}

export default function Badge({ category }: BadgeProps) {
    const color = CATEGORY_COLORS[category]

    return (
        <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${color}20`, color }}
        >
            {category}
        </span>
    )
}