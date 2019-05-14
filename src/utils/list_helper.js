const lodash = require('lodash')

//Etsii blogien joukosta sen bloggaajan, jonka blogeilla on yhteensä eniten likejä
//Palauttaa authorin nimen ja likejen totaalilukeman
const mostLikes = (blogs) => {
  //Listataan kaikki authorit ja niiden liket
  let bloggersList = []
  const record = (author, likes) => {
    //Jos author löytyy, lisätään liket sille
    let found = lodash.find(bloggersList, ['author', author])
    if (found) {
      found.likes += likes
    } else {
      //Muuten luodaan uusi olio ja lisätään se
      let newB = { author: author, likes: likes }
      let temp = bloggersList.concat(newB)
      bloggersList = temp
    }
  }

  lodash.forEach(blogs, (blog) => {
    record(blog.author, blog.likes)
  })
  //console.log('lopputulos: ', bloggersList);

  let winner = lodash.maxBy(bloggersList, (o) => {
    return o.likes
  })
  //console.log('winner: ', winner);
  return winner
}

//Etsii blogien joukosta sen kirjoittajan, jolla on eniten blogeja.
//Palauttaa kirjailijan nimen ja blogien määrän
const mostBlogs = (blogs) => {
  //Lasketaan authoreiden blogien määrät
  const bloggers = lodash.countBy(blogs, (blog) => {
    return blog.author
  })
  console.log('bloggers: ', bloggers)

  //Käydään bloggers läpi ja laitetaan authorit ja blogien määrät taulukkoon
  //key, value -pareihin: author, count
  let bloggersList = []
  const addBlogger = (value, key) => {
    let newB = { author: key, count: value }
    let temp = bloggersList.concat(newB)
    bloggersList = temp
  }
  lodash.forIn(bloggers, (value, key) => {
    addBlogger(value, key)
  })
  //console.log(`bloggers list: ${JSON.stringify(bloggersList)}`)

  //Etsitään author, jolla eniten blogeja
  let bestBlogger = lodash.maxBy(bloggersList, (o) => {
    return o.count
  })
  return bestBlogger
}

const totalLikes = (blogs) => {
  const totalLikes = blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
  return totalLikes
}

//Etsii sen blogin jolla on eniten likejä ja palauttaa sen, jos blogs on {} palauttaa falsyn
const favoriteBlog = (blogs) => {

  let favoriteBlog = lodash.maxBy(blogs, (o) => {
    return o.likes
  })
  return favoriteBlog
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}