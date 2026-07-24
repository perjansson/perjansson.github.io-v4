const isContentfulAsset = (url: string) => url.includes('ctfassets.net')

const withProtocol = (url: string) =>
  url.startsWith('//') ? `https:${url}` : url

export const contentfulImageUrl = (
  url: string,
  { width, quality = 75 }: { width: number; quality?: number }
) => {
  if (!isContentfulAsset(url)) {
    return url
  }

  return `${withProtocol(url)}?w=${width}&q=${quality}&fm=webp`
}

export const contentfulImageSrcSet = (
  url: string,
  widths: number[],
  quality = 75
) => {
  if (!isContentfulAsset(url)) {
    return undefined
  }

  return widths
    .map((w) => `${contentfulImageUrl(url, { width: w, quality })} ${w}w`)
    .join(', ')
}
