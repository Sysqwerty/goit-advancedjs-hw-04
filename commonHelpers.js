import{a as u,S as L,i as b}from"./assets/vendor-c493984e.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function s(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(t){if(t.ep)return;t.ep=!0;const i=s(t);fetch(t.href,i)}})();const f=40,e={page:1,per_page:f,receivedHits:0,searchQuery:null,isLoading:!1,isScrollListenerAdded:!1},a={form:document.querySelector(".search-form"),gallery:document.querySelector(".gallery"),loader:document.querySelector(".loader"),submitButton:document.querySelector('[type="submit"]')},m={API_KEY:"44202133-14fac6110a8eccaaec992feaf",AXIOS_KEY:"live_nOdnL3Dj9jjF4zVLjteozldoqmiVUxxCRsrlPoRVyonLQDm4DFuaUNiaRzafsnXC"},w="https://pixabay.com/api/";u.defaults.headers.common["x-api-key"]=m.AXIOS_KEY;u.defaults.headers=["Access-Control-Allow-Origin"];async function v(){const o=new URLSearchParams({key:m.API_KEY,q:e.searchQuery,image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:e.per_page,page:e.page}),s=await(await u.get(`${w}?${o.toString()}`)).data;return console.log(`data:
`,s),s}const g=new L(".gallery a",{captionsData:"alt",captionDelay:250});g.on("error.simplelightbox",function(o){console.log(o)});a.form.addEventListener("submit",S);function d(){window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-50&&p()}async function S(o){o.preventDefault(),e.isScrollListenerAdded||(window.addEventListener("scroll",d),e.isScrollListenerAdded=!0);const r=new FormData(o.currentTarget);if(e.searchQuery=r.get("searchQuery").trim(),a.form.reset(),!e.searchQuery){c("Please enter a search query.","error"),a.loader.classList.add("hide"),e.isLoading=!1;return}e.page=1,e.receivedHits=0,e.per_page=f,a.gallery.innerHTML="",a.loader.classList.remove("hide"),await p(!0)}async function p(o=!1){if(!e.isLoading){e.isLoading=!0,a.loader.classList.remove("hide"),a.submitButton.disabled=!0;try{const{totalHits:r,hits:s}=await v();if(!r||!(s!=null&&s.length)){c("Sorry, there are no images matching your search query. Please try again.","error");return}if(A(s),g.refresh(),e.page++,e.per_page=Math.min(r-e.receivedHits,f),e.receivedHits+=s.length,o)c(`Hooray! We found ${r} images.`,"success");else{const{height:n}=a.gallery.firstElementChild.getBoundingClientRect();window.scrollBy({top:n*2,behavior:"smooth"})}o&&e.per_page>=r&&(window.removeEventListener("scroll",d),e.isScrollListenerAdded=!1),e.receivedHits>=r&&(setTimeout(()=>{c("We're sorry, but you've reached the end of search results.","info")},1e3),window.removeEventListener("scroll",d),e.isScrollListenerAdded=!1)}catch{c("Error fetching data. Please try again.","error")}finally{a.loader.classList.add("hide"),a.submitButton.disabled=!1,e.isLoading=!1}}}function A(o){const r=o.map(({largeImageURL:s,webformatURL:n,tags:t,likes:i,views:l,comments:y,downloads:h})=>`
      <div class="photo-card">
        <a href="${s}" class="card-link">
          <img src="${n}" alt="${t}" class="card-image" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes</b> ${i}</p>
          <p class="info-item"><b>Views</b> ${l}</p>
          <p class="info-item"><b>Comments</b> ${y}</p>
          <p class="info-item"><b>Downloads</b> ${h}</p>
        </div>
      </div>
    `).join("");a.gallery.insertAdjacentHTML("beforeend",r)}function c(o,r="info",s=3){b[r]({message:o,position:"topRight",timeout:s*1e3})}
//# sourceMappingURL=commonHelpers.js.map
