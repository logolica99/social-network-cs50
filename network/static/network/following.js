
document.addEventListener('DOMContentLoaded', function() {
   
   
    
    load_page();
})




function load_page(){
    

    fetch('/following')
   .then(response => response.json())
   .then(posts =>{
       
       all_posts = document.querySelector('.posts')
       all_posts.innerHTML = ''
       
       posts.forEach(element => {
          post = document.createElement('div');
          post.classList.add("post");
          html = `
                       <a href='/user/${element['username']}'><h4>${element['username']}</h4></a> 
                       
                       <p id="content${element['id']}">${element['content']}</p> 
                   
                   `
           if(document.querySelector("#top_username").innerHTML==element["username"]){

               
               html+=    `
                       <a id="edit"data-id="${element['id']}">Edit</a>
                       <div id="edit-box${element['id']}" style="display:none">
                      
                           <textarea data-id="${element['id']}"   id="edit_text${element['id']}"   rows="4" cols="50">${element['content']}</textarea>
                           <button class="btn btn-info" id="submit${element['id']}">Submit</button>
                       </div>
                       
                        
                       
                  `
           }
          if(element["liked"] == false){
               html += `
                       <p class="date">${element['created_at']}</p> 
                       <p> <button data-id="${element['id']}" id="like" class="btn btn-dark btn-sm"  >Like</button> ${element['likes']}&#10084</p>    
                       
                   `
          }else{
           html+= `
                   <p class="date">${element['created_at']}</p> 
                   <p><button data-id="${element['id']}" id="unlike" class="btn btn-dark btn-sm" >Unlike</button>  ${element['likes']}&#10084</p>    

               `
          }
               post.innerHTML+=html
          all_posts.appendChild(post)
           
       });
       
       

   
   document.querySelectorAll("#like").forEach( like =>{
       like.addEventListener('click',()=>{
        like.disabled=true;
    
       fetch('/all_posts',{
           method:'PUT',
           body:JSON.stringify({
               like: true,
               post_id: like.dataset.id
           })
       })
       setTimeout(()=>load_page(),200)
   })})
   document.querySelectorAll("#unlike").forEach( like =>{
       like.addEventListener('click',()=>{
        like.disabled=true
       fetch('/all_posts',{
           method:'PUT',
           body:JSON.stringify({
               like: false,
               post_id: like.dataset.id
           })
       })
       setTimeout(()=>load_page(),200)
      
   })})
})
}