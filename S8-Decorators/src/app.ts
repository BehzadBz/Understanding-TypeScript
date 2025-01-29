function Logger(logString: string) {
  console.log("LOGGING FACTORY");
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

function WithTemplate(template: string, hoodId: string) {
  console.log("TEMPLATE FACTORY");
  return function <
    T extends {
      new (...args: any[]): { name: string };
    },
  >(originalConstructor: T) {
    return class extends originalConstructor {
      constructor(..._: any[]) {
        super();
        console.log("Rendering template");
        const hookEl = document.getElementById(hoodId);

        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector("h1")!.textContent = this.name;
        }
      }
    };
  };
}

// @Logger("LOGGING - PERSON")
@Logger("LOGGING")
@WithTemplate("<h1>My Person Object</h1>", "app")
class Person {
  name = "Behzad";

  constructor() {
    console.log("Creating person object...");
  }
}

const pers = new Person();

console.log(pers);

//---

function Log(target: any, propertyName: string | Symbol) {
  console.log("Property decorator!");
  console.log(target, propertyName);
}

function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log("Accessor decorator!");
  console.log(target);
  console.log(name);
  console.log(descriptor);
  return {};
}

function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor,
) {
  console.log("Method decorator!");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log4(target: any, name: string | Symbol, position: number) {
  console.log("Parameter decorator!");
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  @Log
  title: string;

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error("Price not set");
    }
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}

const p1 = new Product("Book A", 19);
const p2 = new Product("Book B", 29);

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      return originalMethod.bind(this);
    },
  };
  return adjustedDescriptor;
}

class Printer {
  message = "This works!";

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();

const button = document.querySelector("button")!;
button.addEventListener("click", p.showMessage);

//---

interface ValidatorConfig {
  [prperty: string]: {
    [validatableProp: string]: string[]; // ['required', 'positive']
  };
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      "required",
    ],
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      "required",
    ],
  };
}

function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    return true;
  }
  let isValid = true;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case "required":
          isValid = isValid && !!obj[prop];
          break;
        case "positive":
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseFrom = document.querySelector("form")!;
courseFrom.addEventListener("submit", (e) => {
  e.preventDefault();
  const titleEl = document.getElementById("title") as HTMLInputElement;
  const priceEl = document.getElementById("price") as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createCourse = new Course(title, price);

  if (!validate(createCourse)) {
    alert("Invalid input!");
    return;
  }

  console.log(createCourse);
});
