const App = {
    $: {
        inputs: document.querySelectorAll('.input'),
        form: document.querySelector('#postcodecheck')
    },
    validateForm() {
        App.$.form.addEventListener('focusout', (event) => {
            const focusedInput = event.target;
            
            if(focusedInput.hasAttribute('required') && focusedInput.value === "") {
                focusedInput.classList.add('invalid');
            }

        });
    },
    async getZipCode(zipcode, number) {
        const request = await fetch(`https://postcode.tech/api/v1/postcode?postcode=${zipcode}&number=${number}`, {
                headers: {
                    "Authorization": "Bearer 56c91139-6b7d-4de7-92e3-9cf2b29353a5"
                }
            }
        );

        const response = await request.json();

        console.log(response);
        
    },
    init () {
        this.validateForm();
    }
}

App.init();