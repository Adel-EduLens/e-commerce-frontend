export function Star({ fill }: { fill: number }) {
  // fill: 0 -> 1 (0% -> 100% of the star is colored)
  const isFull = fill >= 0.75
  const isHalf = fill >= 0.25 && fill < 0.75

  const src = isFull
    ? 'material-symbols_star.svg'
    : isHalf
      ? 'material-symbols_star_half.svg'
      : 'material-symbols_star_empty.svg'

  return (
    <img className="h-6 w-6" src={'/home-page/' + encodeURIComponent(src)} alt="" draggable={false} />
  )
}