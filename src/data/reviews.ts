export interface Review {
  id: number
  name: string
  stars: number
  text: string
}

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Debora',
    stars: 5,
    text: 'Our stacks of photo albums were warping, and the photos were sticking to the pages and ruining the pictures. Matteo scanned all our photo albums, eliminated them, and we uploaded our pictures to the cloud, where we are able to enjoy the pictures and memories forever! Great job!',
  },
  {
    id: 2,
    name: 'Mary',
    stars: 4,
    text: 'I handed over four old albums that were falling apart. Matteo picked them up himself and treated everything carefully. The scans came back clean, bright, and perfectly organized. My parents loved being able to see their memories on a slideshow again. Simple, fast, and honestly a huge relief',
  },
  {
    id: 3,
    name: 'Paul',
    stars: 4,
    text: "I didn't have time to scan hundreds of photos. Matteo handled pickup, kept me updated, and delivered sharp, organized digital files. Everything was labeled, easy to browse, and backed up on my cloud. Great service, fair price, and zero hassle. I've already recommended him to friends",
  },
]
