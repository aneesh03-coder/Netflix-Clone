window.onload = () => {
  getOriginals();
  trendingNow_API();
  topRated_API();
  getGenres();
};

window.onclick=(evt)=>{
  var modalIsOpen=document.getElementById("trailerModal").style.display;  
  var modal=document.querySelector("modal fade");
  if(modalIsOpen == "block" && !modal.contains(evt.target)){    
    closeIframe();
  }
  
}


async function getMovieTrailer(id){
  var url=`https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`;
  return await fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
    } else {
        throw new Error("something went wrong");
    }
    });
   
}
const setTrailer=(trailers)=>{
  const iframe=document.getElementById('movieTrailer');
  const movieNotFound = document.querySelector('.movieNotFound');
  if(trailers.length >0){
    movieNotFound.classList.add('d-none');
        iframe.classList.remove('d-none');
    iframe.src=`http://www.youtube.com/embed/${trailers[0].key}`;
  }
  else {
    iframe.classList.add('d-none');
    movieNotFound.classList.remove('d-none');
}
}

const setMovieDescription=(movieDescription)=>{
  console.log(movieDescription);
  const titleSection=`<div class="modal__movie__description"><h5>Title</h5><h5>Description:</h5><h5>Release Date:</h5><h5>Rating:</h5></div>`;
  var descriptionSection=`<div class="modal_desc">`;
  const movieTitle=`<h5>${movieDescription.movie_title}</h5>`;
  const overview=`<h5>${movieDescription.overview}</h5>`;
  const releaseDate=`<h5>${movieDescription.release_date}</h5>`;
  const rating=`<h5>${movieDescription.rating}</h5>`;
  descriptionSection=descriptionSection+movieTitle+overview+releaseDate+rating+`</div>`;
  const movieDetails=titleSection+descriptionSection;
  
   document.getElementById('movie__desc').innerHTML=movieDetails;

}



 function handleMovieSelection(e,movieDescription){
  
const id=e.target.getAttribute('data-id');
const iframe=document.getElementById('movieTrailer');

 getMovieTrailer(id).then((data)=>{
  // console.log(data.results);
  const results=data.results;
  const youtubeTrailers=results.filter((result)=>{
    if(result.site == "YouTube" && result.type == "Trailer"){
      return true;
    }else{
      return false;
    }
  })
  setTrailer(youtubeTrailers);
  setMovieDescription(movieDescription);
});




$('#trailerModal').modal('show');

  //here we need the id of the movie

  //we need to call the api with the ID
};


//Add movies to the front end

function showMovies(movies, element_selector, path_type) {
  // console.log(movies);
  var moviesEl = document.querySelector(element_selector);
  for (var movie of movies.results) {
    //  console.log(movie);
    var imageElement=document.createElement('img');
    imageElement.setAttribute('data-id',movie.id);
    imageElement.src=`https://image.tmdb.org/t/p/original/${movie[path_type]}`;
    let movieDescription={
      "movie_title":movie.name || movie.original_name || movie.original_title || movie.name || "",
      "overview":movie.overview,
      "release_date":movie.first_air_date,
      "rating":movie.vote_average,
    };
    imageElement.addEventListener('click',(e)=>{
      
      handleMovieSelection(e,movieDescription);
        });

    // var image = `
    // <img src="https://image.tmdb.org/t/p/original/${movie[path_type]}"></img>
    // `;

    //If it does
    //Show trailer
    //If not

  //SHow a message
    moviesEl.appendChild(imageElement);
  }
}

function fetchMovies(url, elementSelector, path_type) {
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showMovies(data, elementSelector, path_type);
    });
}

function showMoviesGenres(genres){
// console.log(`These are the Genres ${genres}`);
// console.log(genres);
genres.genres.forEach(function(genre){
  // console.log(genre);
  // Show movies based on genre
  //Get list of movies first
    var movies=fetchMoviesBasedOnGenre(genre.id);
    movies.then(function(movies){
      console.log(movies)
      showMoviesBasedOnGenre(genre.name,movies);
    }).catch((err)=>{
      console.log(err);
    })

})
}

function showMoviesBasedOnGenre(genreName,movies){
  let allMovies =document.querySelector('.movies');
  // console.log(genreName);
  let genreEl=document.createElement('div');
  genreEl.classList.add('movies__header');
  genreEl.innerHTML=`<h2>${genreName}</h2>`
  
  let moviesEl=document.createElement('div');
  moviesEl.classList.add('movies__container');
  moviesEl.setAttribute('id',genreName);

  // var html=`<div class="movies__header"><h2>${genreName}</h2></div>
  // <div id="${genreName} class="movies__container"></div>`;

  // allMovies.innerHTML+=html;

  for (var movie of movies.results) {
    //  console.log(movie);
    var imageElement=document.createElement('img');
    imageElement.setAttribute('data-id',movie.id);
    // console.log(movie);
    imageElement.src=`https://image.tmdb.org/t/p/original/${movie["backdrop_path"]}`;
    let movieDescription={
      "movie_title":movie.name || movie.original_name || movie.original_title || movie.name || "",
      "overview":movie.overview,
      "release_date":movie.first_air_date || movie.release_date,
      "rating":movie.vote_average,
    };
    imageElement.addEventListener('click',(e)=>{
      
      handleMovieSelection(e,movieDescription);
        });

    // var image = `
    // <img src="https://image.tmdb.org/t/p/original/${movie[path_type]}"></img>
    // `;

    //If it does
    //Show trailer
    //If not

  //SHow a message
    moviesEl.appendChild(imageElement);
  }
  allMovies.appendChild(genreEl);
  allMovies.appendChild(moviesEl);

}

 function fetchMoviesBasedOnGenre(genreId){
  var url="https://api.themoviedb.org/3/discover/movie?";
  url+="api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1";
  url +=`&with_genres=${genreId}`;
  return  fetch(url)
  .then((response) => {
    if(response.ok){
      return response.json();
    }else{
      throw new Error("Somewthing went wrong");
    }
    
  })
  
}

//Get genres

const  getGenres =()=>{
  const url="https://api.themoviedb.org/3/genre/movie/list?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US";
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showMoviesGenres(data);
    })
    .catch((error_data)=>{
      console.log(error_data);
    });
}


function getOriginals() {
  var url =
    "https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213";
  fetchMovies(url, ".original__movies", "poster_path");
}
function trendingNow_API() {
  var url =
    "https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045";

  fetchMovies(url, ".trending__now", "backdrop_path");
}

function topRated_API() {
  url =
    "https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1";
  fetchMovies(url, ".top__rated", "backdrop_path");
}

// function addMovies(movies) {
//   // Add img element  to the original _movies element
//   console.log(movies);
//   var moviesEl = document.querySelector(".original__movies");
//   for (var movie of movies.results) {
//     var image = `
//     <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}"></img>
//     `;
//     moviesEl.innerHTML += image;
//   }
// }

// function add_trendingNow_API(movies) {
//   console.log(movies);
//   var moviesEl = document.querySelector(".trending__now");
//   for (var movie of movies.results) {
//     var image = `
//     <img src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}"></img>
//     `;
//     moviesEl.innerHTML += image;
//   }
// }

// function add_topRated_API(movies) {
//   console.log(movies);
//   var moviesEl = document.querySelector(".top__rated");
//   for (var movie of movies.results) {
//     var image = `
//     <img src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}"></img>
//     `;
//     moviesEl.innerHTML += image;
//   }
// }

// function addTrending() {
//   var moviesEl = document.querySelector(".trending__now");
//   for (var i = 0; i < 18; i++) {
//     moviesEl.innerHTML +=
//       '<img src="https://image.tmdb.org/t/p/original//wzJRB4MKi3yK138bJyuL9nx47y6.jpg">';
//   }
// }

// function topRated() {
//   var moviesEl = document.querySelector(".top__rated");
//   for (var i = 0; i < 18; i++) {
//     moviesEl.innerHTML +=
//       '<img src="https://image.tmdb.org/t/p/original//wzJRB4MKi3yK138bJyuL9nx47y6.jpg">';
//   }
// }


function closeIframe(){
  document.getElementById("movieTrailer").src="";
}