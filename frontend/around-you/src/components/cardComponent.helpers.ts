export type CardComponentVariant = 'default' | 'search'
export type CardComponentSurface = 'white' | 'blue'

export type CardComponentItem = {
  id: string
  name: string
  description: string
  image: string
  rating: number
  reviews: number
  tags: string[]
  metaText?: string
  href?: string
}

export const getCardComponentClass = (
  variant: CardComponentVariant,
  surface: CardComponentSurface,
) => {
  const surfaceClass = surface === 'blue' ? 'bg-[#C1D2DE]' : 'bg-white'

  return [
    'group cursor-pointer overflow-hidden shadow-sm transition-shadow hover:shadow-md',
    variant === 'search'
      ? `flex h-full flex-col rounded-xl border border-gray-100 ${surfaceClass}`
      : `rounded-xl border border-gray-100 ${surfaceClass}`,
  ].join(' ')
}

export const getCardComponentImageClass = () =>
  'h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'

export const getCardComponentFallbackClass = () =>
  'flex h-full items-center justify-center px-4 text-center'

export const getCardComponentDescriptionClass = (surface: CardComponentSurface) =>
  surface === 'blue'
    ? 'mt-1 line-clamp-3 text-xs leading-relaxed text-gray-700'
    : 'mt-1 line-clamp-3 text-xs leading-relaxed text-gray-500'

export const getCardComponentMetaClass = (surface: CardComponentSurface) =>
  surface === 'blue' ? 'text-xs text-gray-700' : 'text-xs text-gray-400'

export const getCardComponentTagClass = (surface: CardComponentSurface) =>
  surface === 'blue'
    ? 'rounded-full border border-gray-200 px-2 py-0.5 text-[10px] text-gray-700'
    : 'rounded-full border border-gray-200 px-2 py-0.5 text-[10px] text-gray-500'
