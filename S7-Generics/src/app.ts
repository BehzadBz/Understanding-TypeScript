// const names: Array<string> = []; // string[];
// // names[0].split(" ");
//
// const promise: Promise<string> = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("This is done!");
//   }, 2000);
// });
//
// promise.then((data) => {
//   data.split("");
// });

function merge<T extends object, U extends object>(objA: T, objB: U) {
    return Object.assign(objA, objB);
}

const mergeObj = merge({name: "Behzad"}, {age: 34});
console.log(mergeObj.age);

interface Lengthy {
    length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
    let descriptionText = "Got no value.";
    if (element.length === 1) {
        descriptionText = "Got 1 element.";
    } else if (element.length > 1) {
        descriptionText = `Got ${element.length} elements`;
    }
    return [element, descriptionText];
}

console.log(countAndDescribe("Behzad"));

function extractAndConvert<T extends object, U extends keyof T>(
    obj: T,
    key: U,
) {
    return "Value: " + obj[key];
}

extractAndConvert({name: "Behzad"}, "name");

class DataStorage<T extends string | number | boolean> {
    private data: T[] = [];

    addItem(item: T) {
        this.data.push(item);
    }

    removeItem(item: T) {
        if (this.data.indexOf(item) === -1) {
            return;
        }
        this.data.splice(this.data.indexOf(item), 1);
    }

    getItems() {
        return [...this.data];
    }
}

const textStorage = new DataStorage<string>();
textStorage.addItem("Behzad");
textStorage.addItem("Behnam");
textStorage.removeItem("Behzad");
console.log(textStorage.getItems());

const numberStorage = new DataStorage<number>();

// const objStorage = new DataStorage<object>();
// const behzadObj = { name: "Behzad" };
// objStorage.addItem(behzadObj);
// objStorage.addItem({ name: "Behnam" });
// //...
// objStorage.removeItem(behzadObj);
// console.log(objStorage.getItems());

interface CourseGoal {
    title: string;
    description: string;
    completeUntil: Date;
}

function createCourseGoal(
    title: string,
    description: string,
    date: Date,
): CourseGoal {
    let courseGoal: Partial<CourseGoal> = {};
    courseGoal.title = title;
    courseGoal.description = description;
    courseGoal.completeUntil = date;
    return courseGoal as CourseGoal;
}

const names: Readonly<string[]> = ["Behzad", "Anna"];
// names.push("Behnam");
// names.pop();
