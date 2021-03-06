const App = {
    $: {
      inputs: document.querySelectorAll(".input"),
      inputZipcode: document.querySelector("#postcode"),
      inputHouseNumber: document.querySelector("#huisnummer"),
      inputStreet: document.querySelector("#straatnaam"),
      inputCity: document.querySelector("#stad"),
      form: document.querySelector("#postcodecheck"),
      zipcode: "",
      housenumber: ""
    },
  
    sendForm() {
      App.$.form.addEventListener("submit", (event) => {
        event.preventDefault();
        fetch("https://mockbin.com/request", {
          method: "POST",
          body: new FormData(App.$.form)
        })
          .then((response) => {
            App.$.form.classList.add("hide--form");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
  
    validateInputField(input) {
      return input.hasAttribute("required") && input.value === ""
        ? input.classList.add("invalid")
        : "";
    },
  
    validateZipcode(input) {
      const dutchZipCode = /^[1-9][0-9]{3}?(?!sa|sd|ss)[a-zA-Z]{2}$/g;
      //zipcode should be min 6 charachters
      if (input.name === "postcode" && input.value.length === 6) {
        if (dutchZipCode.test(input.value)) {
          App.$.zipcode = input.value;
        }
      }
    },
  
    validateHouseNumber(input) {
      if (input.name === "huisnummer" && input.value.length >= 1) {
        App.$.housenumber = input.value;
        this.getStreetAndCityData();
      }
    },
  
    getStreetAndCityData() {
      this.getZipCode(App.$.zipcode, App.$.housenumber)
        .then((data) => {
          if ("street" in data) {
            App.$.inputStreet.value = data.street;
            App.$.inputCity.value = data.city;
          }
        })
        .catch((e) => {
          alert(`Verkeerd combinatie van postcode en huisnummer`);
          App.$.inputZipcode.value = "";
          App.$.inputHouseNumber.value = "";
        });
    },
  
    validateForm() {
      App.$.form.addEventListener("focusout", (event) => {
        const focusedInput = event.target;
  
        this.validateInputField(focusedInput);
        this.validateZipcode(focusedInput);
        this.validateHouseNumber(focusedInput);
      });
  
      //All validation is done, send form
      this.sendForm();
    },
  
    async getZipCode(zipcode, number) {
      let request = await fetch(
        `https://postcode.tech/api/v1/postcode?postcode=${zipcode}&number=${number}`,
        {
          headers: {
            Authorization: "Bearer 56c91139-6b7d-4de7-92e3-9cf2b29353a5"
          }
        }
      );
  
      if (!request.ok) {
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
  