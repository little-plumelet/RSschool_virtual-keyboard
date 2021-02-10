let keyLayoutOriginalShift = [
     "~","!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "backspace",
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p","{", "}",
    "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ":", "\"", "|","enter",
    "done", "z", "x", "c", "v", "b", "n", "m", "<", ">", "?",
    "shift", "space", "en/ru"
];

let keyLayoutOriginal = [
    "`","1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
   "q", "w", "e", "r", "t", "y", "u", "i", "o", "p","[", "]",
   "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "\\","enter",
   "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
   "shift", "space", "en/ru"
];

let keyLayoutRussianShift = [
    "ё","!", "\"", "№", ";", "%", ":", "?", "*", "(", ")", "_", "+", "backspace",
    "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з","х", "ъ",
    "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "/", "enter",
    "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ",",
    "shift", "space", "en/ru"
];

let keyLayoutRussian = [
    "ё","1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
    "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з","х", "ъ",
    "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "\\", "enter",
    "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
    "shift", "space", "en/ru"
];

let keyLayout = keyLayoutOriginal;

let mediator = false;

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
    },

    eventHandlers: {
        oninput: null,
        onclose: null,
    },

    properties: {
        value: "",
        capsLock: false,
        shift: false,
        russian: false,
    },

    init() {
        //create  main elemnts
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        //Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());
        
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        //add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        //Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    remove() {
        let removing = document.querySelector(".keyboard");
        removing.remove();
    },

    //private method
    _createKeys() {
        const fragment = document.createDocumentFragment();
        
        //create HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons"> ${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            let insertLineBreak;
            if (keyLayout[0] == "`") {
                insertLineBreak = ["backspace", "]", "enter", "/"].indexOf(key) !== -1;
            }
            else if (keyLayout[0] == "ё") {
                insertLineBreak = ["backspace", "ъ", "enter", "."].indexOf(key) !== -1;
            }

            else if (keyLayout[0] == "~") {
                insertLineBreak = ["backspace", "}", "enter", "?"].indexOf(key) !== -1;
            }

            if (keyLayout[3] == "№") {
                insertLineBreak = ["backspace", "ъ", "enter", ","].indexOf(key) !== -1;
            }

            //add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvents("oninput");
                    });

                    break;

                    case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", "caps");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");
                    

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        mediator = true;
                        keyElement.classList.toggle("keyboard__key--active");//, this.properties.capsLock);
                        //caps = document.querySelector(".caps");
                        //if (mediator) caps.classList.toggle("keyboard__key--active");
                    });
                    break;

                    case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvents("oninput");
                    });

                    break;

                    case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvents("oninput");
                    });

                    break;

                    case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key-dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvents("onclose");
                    });

                    break;

                    case "shift":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", "shift");
                    keyElement.textContent = "shift";
                    keyElement.innerHTML = createIconHTML("");
                    //document.querySelector("i").textContent = "Shift";
                

                    keyElement.addEventListener("click", () => {
                        //keyElement.classList.add("keyboard__key--active");
                    this._toggleShift();
                    this._toggleCapsLock();
                    //keyElement.classList.toggle("keyboard__key--active", this.properties.shift);//, this.properties.capsLock);
                    //document.query.selector(".caps").classList.toggle("keyboard__key--active",  this.properties.capsLock);
                    //keyElement.classList.toggle("keyboard__key--active");
                    document.querySelector(".shift").classList.toggle("keyboard__key--active", this.properties.shift, this.properties.capsLock);
                         //keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock, this.properties.capsLock);
                         
                    });


                    break;

                    case "en/ru":
                        keyElement.classList.add("keyboard__key--wide");
                        
                        this.properties.russian?  keyElement.textContent = "ru" : keyElement.textContent = "en";
                       
                        keyElement.addEventListener("click", () => {
                            
                            this._toggleChangeLanguage()
                            keyElement.classList.toggle("keyboard__key--active", this.properties.russian);
                        });

                        break;
    
                    default:
                        keyElement.textContent = key.toLowerCase();
    
                        keyElement.addEventListener("click", () => {
                            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                            this._triggerEvents("oninput");
                        });
    
                        break;
            }

            

            fragment.appendChild(keyElement);


            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _triggerEvents(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
       this.properties.capsLock = !this.properties.capsLock;
       for (const key of this.elements.keys) {
           if (key.childElementCount === 0) {
               key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
           }
       }
    },

    _toggleChangeLanguage() {
        this.properties.capsLock = false;
        this.properties.shift = false;
        this.properties.russian = !this.properties.russian;
        let keyElement = document.querySelectorAll(".keyboard__key");
        if (this.properties.russian) {
            keyLayout = keyLayoutRussian;
           /* for (let i = 0; i < keyElement.length; i++) {
                if (keyElement[i].childElementCount === 0) {
                        console.log(keyElement[i]);
                        keyElement[i].textContent = keyLayout[i];
                        //this.properties.value += this.properties.capsLock ? keyElement[i].textContent.toUpperCase() : keyElement[i].textContent.toLowerCase();
                }
            }*/
            this.remove();
            this.init();
            this.elements.main.classList.remove("keyboard--hidden");
    }
        else {
            keyLayout = keyLayoutOriginal;
            this.remove();
            this.init();
            this.elements.main.classList.remove("keyboard--hidden");
        }
       
    },

    _toggleShift() {
        this.properties.shift = !this.properties.shift;
        if (!document.querySelector(".caps").classList.contains("keyboard__key--active")) mediator = false;

        if (this.properties.shift && !this.properties.russian) {
            keyLayout = keyLayoutOriginalShift;
            this.remove();
            this.init();
            let caps = document.querySelector(".caps");
            if (mediator) caps.classList.toggle("keyboard__key--active");
            this.elements.main.classList.remove("keyboard--hidden");
        }

        else if (this.properties.shift && this.properties.russian) {
            keyLayout = keyLayoutRussianShift;
            this.remove();
            this.init();
            let caps = document.querySelector(".caps");
            if (mediator) caps.classList.toggle("keyboard__key--active");
            this.elements.main.classList.remove("keyboard--hidden");
        }
        else if (!this.properties.shift && !this.properties.russian) {
            keyLayout = keyLayoutOriginal;
            this.remove();
            this.init();
            let caps = document.querySelector(".caps");
            if (mediator) caps.classList.toggle("keyboard__key--active");
            this.elements.main.classList.remove("keyboard--hidden");
        }

        else if (!this.properties.shift && this.properties.russian) {
            keyLayout = keyLayoutRussian;
            this.remove();
            this.init();
            let caps = document.querySelector(".caps");
            if (mediator) caps.classList.toggle("keyboard__key--active");
            this.elements.main.classList.remove("keyboard--hidden");
        }
    },


    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    },
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
    Keyboard.open("dcode", function (currentValue) {
        console.log("value changed! here it is: " + currentValue);
    }, function (currentValue) {
        console.log("keyboard closed! Finishing value: " + currentValue);
    })
})