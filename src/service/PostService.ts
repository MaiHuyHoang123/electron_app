import { In } from "typeorm"
import Post from "../entity/Post"

const puppeteer = require('puppeteer')

type PostType = {
  title: string,
  content: string,
  comment: number,
  score: number
}

export async function getNumPosts(_, keyword) {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.setViewport({ width: 1080, height: 1024 })
  var response = await page.goto('https://www.reddit.com/search?q=' + keyword, {
    waitUntil: 'domcontentloaded'
  })
  var value = {}
  while (true) {
    if (response.status() == 200) {
      value = await page.evaluate(async () => {
        const feed = document.getElementsByTagName('reddit-feed')
        const postItems = feed[0].childNodes
        var result = []
        postItems.forEach((e) => {
          if (e instanceof Element) {
            if (e.hasAttribute('data-faceplate-tracking-context')) {
              var postItem = JSON.parse(e.getAttribute('data-faceplate-tracking-context'))
              result.push({
                title: postItem.post.title,
                url: 'https://www.reddit.com' + postItem.post.url
              })
            }
          }
        })
        return result
      })
      break
    } else {
      response = await page.reload({
        waitUntil: 'domcontentloaded'
      })
    }
  }
  await browser.close()
  return value
}

export async function getPosts(_, urls){
  for(var url of urls){
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1024 });
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
    });
    var value;
    if (response.status() == 200) {
      value = await page.evaluate(async () => {
        const feed = document.getElementsByTagName("shreddit-post");
        const postId = feed[0].getAttribute("id");
        const textContent = document.querySelector(
          "div#" + postId + "-post-rtjson-content"
        );
        const imageContent = document
          .getElementsByClassName("media-lightbox-img")[0]
          ?.querySelector("img#post-image");
        const videoContent = document
          .querySelector("shreddit-player-2")
          ?.shadowRoot?.querySelector("video");
        var result = {
          title: document
            .querySelector("h1#post-title-" + postId)
            .textContent.trim()
            .replace(/[^\w\s.]/g, ""),
          content: "",
          comments: feed[0].getAttribute("comment-count"),
          score: feed[0].getAttribute("score"),
        };
        if (textContent) {
          result.content = JSON.stringify(textContent.outerHTML);
        }
        if (imageContent) {
          result.content = JSON.stringify(imageContent.outerHTML);
        }
        if (videoContent) {
          result.content = `<video controls>
    <source src=${JSON.stringify(videoContent.getAttribute("src"))}>
  </video>`;
        }
        return result;
      });
    }
    await browser.close();
    if(value.title && value.content && value.score && value.comments){
      var post = new Post()
      post.title = value.title;
      post.content = value.content
      post.score = value.score
      post.comments = value.comments
      await post.save()
    }
  }
  return true
}

export async function previewPost(_, url){
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1024 });
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
    });
    if (response.status() == 200) {
    }
    return true;
}
export async function getListPost(_, args) {
  try{
    const allPosts = await Post.find()
    return allPosts
  }catch(e){
    console.log("error: " + e);
    return []
  }
}

export async function deletePost (_, ids) {
  try{
    const posts = await Post.findBy({ id: In(ids) })
    for(var post of posts){
      await post.remove()
    }
    return true
  }catch(e){
    console.log("error: " + e);
    return false
  }
}

export async function uploadPost(_, ids){
  try{
    const posts = await Post.findBy({ id: In(ids) })
    for(var post of posts){
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1024 });
      await page.goto("https://forum.hidemium.io/", {
        waitUntil: "domcontentloaded",
      });
      const btnCreate = await page.$("button#create-topic");
      if (!btnCreate) {
        await page.locator("button.login-button").click();
        await page.locator("input#login-account-name").fill("hoang");
        await page.locator("input#login-account-password").fill("hoang123456");
        await page.locator("button#login-button").click();
      }
      await page.locator("button#create-topic").click();
      await page
        .locator("input#reply-title")
        .fill(post.title);
      await page.locator("textarea.ember-text-area")
        .fill(post.content);
      await page.locator("button.create").click();
      await browser.close();
    }
    return true
  }catch(e){
    console.log("error: " + e);
    return false
  }
  
}
