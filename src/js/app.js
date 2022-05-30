const App = {
    $: {
      inputs: document.querySelectorAll(".input"),
      inputZipcode: document.querySelector("#postcode"),
      inputHouseNumber: document.querySelector("#huisnummer"),
      form: document.querySelector("#postcodecheck"),
      zipcode: "",
      housenumber: ""
    },
    sendForm() {
      App.$.form.addEventListener("submit", (event) => {
        event.preventDefault();
      });
    },
    validateForm() {
      App.$.form.addEventListener("focusout", (event) => {
        const focusedInput = event.target;
        const dutchZipCode = /^[1-9][0-9]{3}?(?!sa|sd|ss)[a-zA-Z]{2}$/g;
  
        if (focusedInput.hasAttribute("required") && focusedInput.value === "") {
          focusedInput.classList.add("invalid");
        }
  
        //zipcode should be min 6 charachters
        if (focusedInput.name === "postcode" && focusedInput.value.length === 6) {
          if (dutchZipCode.test(focusedInput.value)) {
            App.$.zipcode = focusedInput.value;
          }
        }
  
        if (
          focusedInput.name === "huisnummer" &&
          focusedInput.value.length >= 1
        ) {
          App.$.housenumber = focusedInput.value;
            
          //Get street and city on base of the zipcode and housenumber
          this.getZipCode(App.$.zipcode, App.$.housenumber).then((data) => {
            if ("street" in data) {
              App.$.inputStreet.value = data.street;
              App.$.inputCity.value = data.city;
              
            }
          }).catch(e => {
              alert(`Verkeerd combinatie van postcode en huisnummer`);
              App.$.inputZipcode.value = '';
              App.$.inputHouseNumber.value = '';
          });
         
        }
      });
  
      //All validation is done, send form
      this.sendForm();
    },
    async getZipCode(zipcode, number) {
        let request = await fetch(`https://postcode.tech/api/v1/postcode?postcode=${zipcode}&number=${number}`, {
            headers: {
                Authorization: "Bearer 56c91139-6b7d-4de7-92e3-9cf2b29353a5"
            }
        });

        if(!request.ok) {
            throw new Error(`${request.status}`);
        }

        let response = await request.json();
        return response;
    },
    init() {
      this.validateForm();
    }
  };
  
  App.init();
  