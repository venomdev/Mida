export class MidaUtilities {
    private constructor () {
        // Silence is golden.
    }

    // Used to get the minutes difference between two dates.
    public static getMinutesBetweenDates (a: Date, b: Date): number {
        return Math.round(Math.abs(a.getTime() - b.getTime()) / 60000);
    }

    // Used to get the days difference between two dates.
    public static getDaysBetweenDates (a: Date, b: Date): number {
        const sanitizedLeftDate: number = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const sanitizedRightDate: number = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor(Math.abs((sanitizedLeftDate - sanitizedRightDate) / (1000 * 60 * 60 * 24)));
    }

    // Used to create a Promise, resolved after a given number of milliseconds.
    public static async wait (milliseconds: number): Promise<void> {
        await new Promise((resolve: (value?: any) => void): any => setTimeout(resolve, milliseconds));
    }

    // Used to shuffle an array.
    public static shuffleArray (array: any[]): any[] {
        let length: number = array.length;

        while (length > 0) {
            const randomIndex: number = MidaUtilities.generateInRandomInteger(0, length - 1);
            const element: any = array[--length];

            array[length] = array[randomIndex];
            array[randomIndex] = element;
        }

        return array;
    }

    // Used to get a random integer in an inclusive range.
    public static generateInRandomInteger (min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Used to merge two options objects.
    public static mergeOptions (initial: any, primary: any): any {
        const options: any = {
            ...initial,
            ...primary,
        };

        for (const name in initial) {
            if (!initial.hasOwnProperty(name) || !primary.hasOwnProperty(name)) {
                continue;
            }
            
            const initialValue: any = initial[name];
            const userValue: any = primary[name];

            if (!initialValue || !userValue) {
                continue;
            }

            if (initialValue.constructor === Object && userValue.constructor === Object) {
                options[name] = MidaUtilities.mergeOptions(initialValue, userValue);
            }
        }

        return options;
    }

    // Used to get the percentage of a number.
    public static getPercentageOf (subject: number, percentage: number): number {
        return percentage / 100 * subject;
    }

    // Used to get what percentage of a number a number is.
    public static getWhatPercentageOf (subject: number, whatPercentage: number): number {
        return whatPercentage / subject * 100;
    }

    public static async assertPromiseDuration (task: Promise<any>, timeout: number, defaultValue?: any): Promise<any> {
        return new Promise((resolve: any, reject: any): void => {
            setTimeout(() => resolve(defaultValue), timeout);
            task.then((value: any) => resolve(value)).catch((error: any) => reject(error));
        });
    }
}
