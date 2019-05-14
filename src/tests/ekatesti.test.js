const listHelper = require('../utils/list_helper')

//jos kirjoitat test.only() tai describe.only(), ajetaan vain tse testi

const longList = [
  {
    _id: '5c9cb7eebdcafaaa90712177',
    title: 'Sallan reseptit',
    author: 'Salla',
    url: 'https://www.k-ruoka.fi/reseptit',
    likes: 5,
    __v: 0
  },
  {
    _id: '5c9cb84bbdcafaaa90712178',
    title: 'Vanelja',
    author: 'Virpi Mikkonen',
    url: 'http://vanelja.com/',
    likes: 25,
    __v: 0
  },
  {
    _id: '5c9cc51e5f229caff636f076',
    title: 'Tunnelmallisia makuja',
    author: 'Kaisa',
    url: 'https://tunnelmallisiamakuja.com/',
    likes: 15,
    __v: 0
  },
  {
    _id: '5c9cca09818504b161d2a07c',
    title: 'Liemessä',
    author: 'Jenni Häyrinen',
    url: 'http://liemessa.fi/',
    likes: 23,
    __v: 0
  },
  {
    _id: '5c9ccfbcc4791db359635308',
    title: 'Kulinaari',
    author: 'Kaisa',
    url: 'https://kulinaari.blogspot.com/',
    likes: 3,
    __v: 0
  },
  {
    _id: '5c9def27331634bf397eeb34',
    title: 'Peggyn pieni punainen keittio',
    author: 'Peggy Thomas',
    url: 'https://pienipunainenkeittio.com/',
    likes: 2,
    __v: 0
  },
  {
    _id: '5c9df15574d92ec05c8fde03',
    title: 'Mansikkaheinä',
    author: 'Kaisa',
    url: 'https://mansikkaheina.blogspot.com/',
    likes: 8,
    __v: 0
  },
  {
    _id: '5c9df4a0b2a49ec0e22a1865',
    title: 'Viimeistä murua myöten',
    author: 'Virpi Mikkonen',
    url: 'http://www.viimeistamuruamyoten.com/',
    likes: 15,
    __v: 0
  }
]

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const emptyList = []

describe('most likes', () => {
  test('when list is empty', () => {
    const result = listHelper.mostLikes(emptyList)
    expect(result).toBeFalsy()
  })

  test('when list has only one blog, equals the author of that, and 5 likes', () => {
    const best1 =
    {
      author: listWithOneBlog[0].author,
      likes: 5
    }
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(best1).toMatchObject(result)
  })

  test('when list has several blogs', () => {
    const best2 =
    {
      author: 'Virpi Mikkonen',
      likes: 40
    }
    const result = listHelper.mostLikes(longList)
    expect(best2).toMatchObject(result)
  })
})

describe('most blogs', () => {

  test('when list has only one blog, equals the author of that, and 1 blog', () => {
    const best1 =
    {
      author: listWithOneBlog[0].author,
      count: 1
    }
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(best1).toMatchObject(result)
  })

  test('when list has several blogs', () => {
    const best2 =
    {
      author: 'Kaisa',
      count: 3
    }
    let result = listHelper.mostBlogs(longList)
    expect(best2).toMatchObject(result)
  })

  test('when list is empty', () => {
    const result = listHelper.mostBlogs(emptyList)
    expect(result).toBeFalsy()
  })

})


describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has several blogs', () => {
    const result = listHelper.totalLikes(longList)
    expect(result).toBe(96)
  })

  test('when list is empty', () => {
    const result = listHelper.totalLikes(emptyList)
    expect(result).toBe(0)
  })

})

describe('favorite blog', () => {
  const fav1 = listWithOneBlog[0]
  test('when list has only one blog, favorite should be it', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    //toMatchObject riittää että sen argumentin olion kentät ovat expect-olion kenttien subset
    expect(fav1).toMatchObject(result)
  })

  const fav2 = longList[1]
  test('when list has several blogs', () => {
    const result = listHelper.favoriteBlog(longList)
    expect(fav2).toMatchObject(result)
  })

  test('when list is empty', () => {
    const result = listHelper.totalLikes(emptyList)
    expect(result).toBeFalsy()
  })

})