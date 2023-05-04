Vue.createApp({

//change local host to railway app url

	data: function () {
		return {
        title: '',
        imageUrl: '',
        explanation: '',
        selectedDate: '',
        apod: false,
        gallery: true,
        rovers: false,
        apodData: null,
        edit: false,
        images: [],
		//fetchURL: `https://s23-project1-ethanttanner-production.up.railway.app/images',
        //fetchURL: 'http://localhost:8080/images',
		apodUrl: 'https://api.nasa.gov/planetary/apod',
        API_KEY: 'cUrpxE7a3a7eyAX7yJjE3ttt38WIr0DaxRgfb2KQ',
      selectedEndpoint: 'apod',
      selectedDate: '',
      loading: false,
      error: null,
      data: null,
      edit_description: "",
      edit_title: "",
      login_div: null,
      sign_up_div: null,
      first_name: "",
      last_name: "",
      email: "",
      password: "",

    
    }
  },

  methods: {
    fetchApod() {
      fetch(`${this.apodUrl}?api_key=${this.API_KEY}&date=${this.selectedDate}`)
        .then(response => response.json())
        .then(data => {
          //this.load = false;
          this.apodData = data;
        })
        .catch(error => {
          console.log(error);
        });
    },

    fetchData() {
      this.loading = true;
      this.error = null;
      this.data = null;

      let url = '';

      if (this.selectedEndpoint === 'opportunity') {
        url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${this.selectedEndpoint}/photos?earth_date=${this.selectedDate}&api_key=${this.API_KEY}`;
      } else {
        url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${this.selectedEndpoint}/photos?api_key=${this.API_KEY}&earth_date=${this.selectedDate}`;
      }

      fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch data');
          }
        })
        .then((data) => {
          this.loading = false;
          this.data = data;
        })
        .catch((error) => {
          this.loading = false;
          this.error = error
        }
    
    )},

    addToGallery() {
        var data = "img=" + encodeURIComponent(this.apodData.url); 
        data += "&title=" + encodeURIComponent(this.apodData.title);
        data += "&description=" + encodeURIComponent(this.apodData.explanation);

        var fetchurl = "https://s23-sessions-ethanttanner-production.up.railway.app/images?";
        fetchurl += data;
        console.log(fetchurl);
    //    fetch("https://s23-project1-ethanttanner-production.up.railway.app/images", {
      	fetch(fetchurl, {
		    method: "POST",
        credentials: 'include',
          body: data,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        } 

        }).then(response => {

          if (response.status == 201) {
            alert("Added Image!");
            this.getImagesFromServer();
          } else {
            alert("Failed to save Image!");
            console.log("Failed to create image on server!");
          }
        });

    },
    addRoverPhoto(img, date, description) {
        var data = "img=" + encodeURIComponent(img); 
        data += "&title=" + encodeURIComponent(date);
        data += "&description=" + encodeURIComponent(description);
        
        var fetchurl = "https://s23-sessions-ethanttanner-production.up.railway.app/images?";
        fetchurl += data;

        fetch(fetchurl, {
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        } 
        }).then(response => {
          if (response.status == 201) {
            alert("Added Image!");
            this.getImagesFromServer();
          } else {
            alert("Failed to save Image!");
            console.log("Failed to create image on server!");
          }
        });
    },
    showApod() {
      this.apod = true;
      this.rovers = false;
      this.gallery = false;

    },
    showRovers() {
      this.apod = false;
      this.rovers = true;
      this.gallery = false;

    },
    showGallery() {
      this.apod = false;
      this.gallery = true;
      this.rovers = false;

    },


    deleteImage: function (image) {
          console.log("attempt to delete a food");
          if (confirm("Are you sure you want a delete this image?")) {
            this.deleteImageFromServer(image._id);  
          } else {
            console.log("failed");
          }
        },


    deleteImageFromServer: function (ImageId) {
      console.log("ID", ImageId);

        var fetchurl = "https://s23-sessions-ethanttanner-production.up.railway.app/images/";
        fetchurl += ImageId;

      fetch(fetchurl, {
        method: "DELETE",
        credentials: "include"
      }).then(response => {
        console.log("image deleted from server.");
        this.getImagesFromServer();
      });
  },

    editImage: function (image) {
      console.log("attemting to edit food");
  
      this.edit = !this.edit;   
      console.log(this.edit);
      this.edit_description = image.description;
      this.edit_title = image.title;
      console.log(image);

      //if (confirm( - or hide edit elements  
      

    },

    saveEdit: function (image) {
      var data = "img=" + encodeURIComponent(image.img);
        data += "&title=" + encodeURIComponent(this.edit_title);
        data += "&description=" + encodeURIComponent(this.edit_description);

        var fetchurl = "https://s23-sessions-ethanttanner-production.up.railway.app/images/";
        fetchurl += image._id;

        //fetch(`https://s23-project1-ethanttanner-production.up.railway.app/images/${image._id}`, {
          fetch(fetchurl, {
			  method: "PUT",
            body: data,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
          } 
        }).then(response => {
          if (response.status == 200) {
            this.getImagesFromServer();
            this.edit = !this.edit;
          } else {
            console.log("Failed to update image on server!");
          }
        });
},

  toggleSignUp: function () {
    this.login_div = !this.login_div;
    this.sign_up_div = !this.sign_up_div
  },

  signUp: function () {



          var data = "firstName=" + encodeURIComponent(this.first_name);
            data += "&lastName=" + encodeURIComponent(this.last_name);
            data += "&email=" + encodeURIComponent(this.email);
            data += "&password=" + encodeURIComponent(this.password);

        var fetchurl = "https://s23-sessions-ethanttanner-production.up.railway.app/images?";
        fetchurl += data;
        console.log(fetchurl);

      fetch(fetchurl, {
            method: "POST",
            credentials: "include",
            body: data,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
          } 
        }).then(response => {
          console.log(response.status);
          if (response.status == 201) {
            var data1 = "email=" + encodeURIComponent(this.email);
            data1 += "&password=" + encodeURIComponent(this.password);
            var fetchurl1 = "https://s23-project1-ethanttanner-production.up.railway.app/users/login?";
            fetchurl1 += data;
            fetch(fetchurl1, {
              method: "POST",
              credentials: "include",
              body: data1,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            } 
          }).then(response => {
            console.log(response.status);
            if (response.status == 200) {
              this.getImagesFromServer();


            } else {
              console.log("Failed to login!");
              alert("Please enter valid credentials");
            }
          });





            this.first_name = "";
            this.last_name = "";
            this.email = "";
            this.password = "";
            this.sign_up_div = false;
            this.login_div = false;

          } else {
            console.log("Failed to sign up!");
            alert("Please enter all fields");
          }
        });

  },


  login: function () {
        var data = "email=" + encodeURIComponent(this.email);
        data += "&password=" + encodeURIComponent(this.password);
        var fetchurl = "https://s23-project1-ethanttanner-production.up.railway.app//users/login?";
        fetchurl += data;

        fetch(fetchurl, {
            method: "POST",
            credentials: "include",
            body: data,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
          } 
        }).then(response => {
          console.log(response.status);
          if (response.status == 200) {
            this.getImagesFromServer();
            this.email = "";
            this.password = "";
            this.login_div = !this.login_div;

          } else {
            console.log("Failed to login!");
            alert("Please enter valid credentials");
          }
        });


  },

  logout: function () {
    if (confirm("Are you sure you want to logout?")) {
        fetch("https://s23-project1-ethanttanner-production.up.railway.app/users/logout", {
            method: "POST"
          }).then(response => {
            this.login_div = !this.login_div; 
          console.log(response);
        }).catch(error => {
          console.error(error);
        });
      }
    else {
      console.log("nevermind");
    }
    this.getImagesFromServer();

  },



    getImagesFromServer: function () {
        //fetch("https://s23-project1-ethanttanner-production.up.railway.app/images").then(response => {
		//console.log("");
    fetch("https://s23-project1-ethanttanner-production.up.railway.app/images").then(response => {	
      credentials: 'include'
			console.log("response: ", response.status);
          response.json().catch((error) => {
        this.login_div = true;
      }).then(data => {
            if (response.status == 200 || response.status == 201 ) {
              console.log("loaded images from the server: ", data);
              this.images = data;
              console.log("response",response.status);
            }
            else if (response.status == 401 || response.status == 404 || response.status == 503) {
                this.login_div = true;
                this.images = null;
                console.log("response2",response.status);
            }



         });
      }).catch((error) => {
        this.login_div = true;
      });
   
  }
    

  },

  mounted() {
    const url = "https://api.nasa.gov/planetary/apod?api_key=";
    const api_key = "cUrpxE7a3a7eyAX7yJjE3ttt38WIr0DaxRgfb2KQ";
    fetch(url + api_key)
      .then(response => response.json())
      .then(data => {
        this.apodData = data;
        this.title = data.title;
        this.imageUrl = data.url;
        this.explanation = data.explanation;
      })
      .catch(error => {
        console.log(error);
      });
  },

  created: function () {
    this.getImagesFromServer();
  }



//to allow cors in get function
//res.setHeader(Access-Control-Allow-Origin', '*');
}).mount("#app");


