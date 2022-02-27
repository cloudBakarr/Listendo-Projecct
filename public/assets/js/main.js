const $ = (query,fun = null) => {
  if (typeof query === 'object') {
    if (fun) {
      fun(query)
    } else {
      return query
    }
  } else if (typeof query === 'string') {
    if (query.startsWith('#')) {
      let get = document.querySelector(query)
      if (fun && get) {
        fun(get)
      } else {
        return get ;
      }
    } else {
      let get = document.querySelectorAll(query);
      if (fun && get) {
        fun(get)
      } else {
        return get ;
      }
    }
  }
}

const ready = (fun) => {
  window.addEventListener('DOMContentLoaded',function(event){
    fun(event)
  })
}

window.ready = ready ;
window.$ = $ ;

ready(function(){
  $('[ready]').forEach((element)=>{
    let attr = element.getAttribute('ready') ;
    element.removeAttribute('ready');
    if (attr) {
      attr = 'var fn___ = '+attr + ';' ;
      attr = attr.replace(/``/g,'"');
      eval(attr);
      fn___(element)
    }
  })

  $('[showPass]').forEach((element)=>{
    element.addEventListener('click', function(e) {
      let targetID = element.getAttribute('showPass') ;
      let target = document.getElementById(targetID)
      if (target.getAttribute('type') == 'password') {
        element.innerHTML = '<i class="fa fa-eye-slash"></i>'
        target.setAttribute('type', 'text')
      } else {
        element.innerHTML = '<i class="fa fa-eye"></i>'
        target.setAttribute('type', 'password')
      }
      target.focus()
    })
  })

  $('[bg-image]').forEach((element) => {
    let attr = element.getAttribute('bg-image');
    element.removeAttribute('bg-image');
    if (attr) {
      element.style.backgroundImage = `url('${attr}')` ;
    }
  })

  try {
    $('#profileImageInput').addEventListener('change', function(e) {
      $('#profileImageShow').style.backgroundImage = "url('"+URL.createObjectURL(e.target.files[0])+"')"
      $('#profileImageShow').removeChild($('#profileImageShowInner'))
    })
  } catch (e) {}

  try {
    $('#profileImageShow').style.backgroundImage = "url('"+$('#firstUserImage').value+"')"
  } catch (e) { console.log(e.message) }

  try {
    $('#changeInfoForm').addEventListener('submit', function(e) {
      $('#curtain').style.display = 'flex'
    })
  } catch (e) {}

  try {
    $('#addMediaFile').addEventListener('change',function(e) {
      $('#addMediaFileLabel').innerText = e.target.files[0].name
    })
  } catch (e) {}

  try {
    $('#addMediaForm').addEventListener('submit', function(e){
      $('#addMediaFileLabel').innerHTML = 'Uploading <i class="ms-2 fa fa-spinner fa-spin"></i>'
      $('#addMediaButton').addAtteribute('disabled','disabled')
      $('#addMediaButton').addClassName('disable')
    })
  } catch (e) {
    console.log(e)
  }

  $('.delete-a-music').forEach(element => {
    element.addEventListener('click', function(e){
      if (!confirm('Are you sure to delete this music?')) {
        e.preventDefault()
      }
    })
  });
});


function landingPagePaginate(e) {
  // e.preventDefault();
  // fetch(e.target.getAttribute('href')).then(res => res.json()).then(data => {

  // })
}