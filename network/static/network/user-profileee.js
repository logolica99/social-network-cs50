follow_button = document.querySelector("#follow")
unfollow_button = document.querySelector("#unfollow")


if(follow_button!=null){
    follow_button.addEventListener('click', ()=>{
        
        userid=  document.querySelector("#username").innerHTML;
        console.log(userid)
    
        fetch(`/user/${userid}`,{
            method: 'POST',
            body: JSON.stringify({
                'following':true
            })
        })
       

    
    })
}


if(unfollow_button!=null){
   
    document.querySelector("#unfollow").addEventListener('click', ()=>{
        userid=  document.querySelector("#username").innerHTML;
        console.log(userid)
   
        fetch(`/user/${userid}`,{
            method: 'POST',
            body: JSON.stringify({
                'following':false
            })
        })
       

 
       
    })
}