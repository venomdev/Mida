import { PlaygroundBroker } from "!plugins/playground/PlaygroundBroker";
import { PlaygroundBrokerAccount } from "!plugins/playground/PlaygroundBrokerAccount";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";

const broker: PlaygroundBroker = new PlaygroundBroker();

describe("PlaygroundBrokerAccount", () => {
    describe(".localDate", () => {
        it("is set correctly", async () => {
            const actualDate: Date = new Date();
            const account: PlaygroundBrokerAccount = await broker.login();

            account.localDate = actualDate;

            expect(account.localDate.valueOf()).toBe(actualDate.valueOf());
        });
    });

    describe(".negativeBalanceProtection", () => {
        it("is set correctly", async () => {
            const account: PlaygroundBrokerAccount = await broker.login();

            account.negativeBalanceProtection = false;

            expect(account.negativeBalanceProtection).toBe(false);

            account.negativeBalanceProtection = true;

            expect(account.negativeBalanceProtection).toBe(true);
        });
    });

    describe(".fixedOrderCommission", () => {
        it("is set correctly", async () => {
            const fixedCommission: number = 123.45;
            const account: PlaygroundBrokerAccount = await broker.login();

            account.fixedOrderCommission = fixedCommission;

            expect(account.fixedOrderCommission).toBe(fixedCommission);
        });
    });

    describe(".marginCallLevel", () => {
        it("is set correctly", async () => {
            const marginCallLevel: number = 200;
            const account: PlaygroundBrokerAccount = await broker.login();

            account.marginCallLevel = marginCallLevel;

            expect(account.marginCallLevel).toBe(marginCallLevel);
        });
    });

    describe(".stopOutLevel", () => {
        it("is set correctly", async () => {
            const stopOutLevel: number = 10;
            const account: PlaygroundBrokerAccount = await broker.login();

            account.stopOutLevel = stopOutLevel;

            expect(account.stopOutLevel).toBe(stopOutLevel);
        });
    });

    describe(".getBalance", () => {
        it("returns correct balance", async () => {
            const initialBalance: number = 10000;
            const account: PlaygroundBrokerAccount = await broker.login({
                balance: initialBalance,
            });

            expect(await account.getBalance()).toBe(initialBalance);
        });
    });

    describe(".getEquity", () => {
        it("returns balance when no positions are open", async () => {
            const initialBalance: number = 10000;
            const account: PlaygroundBrokerAccount = await broker.login({
                balance: initialBalance,
            });

            expect(await account.getEquity()).toBe(initialBalance);
            expect(await account.getEquity()).toBe(await account.getBalance());
        });
    });

    describe(".loadTicks", () => {
        it("correctly adds ticks for the first time", async () => {
            const account: PlaygroundBrokerAccount = await broker.login();
            const symbol: string = "TEST";
            const ticks: MidaSymbolTick[] = [
                new MidaSymbolTick({
                    quotation: new MidaSymbolQuotation({
                        symbol,
                        date: new Date(),
                        bid: 0,
                        ask: 0,
                    }),
                }),
                new MidaSymbolTick({
                    quotation: new MidaSymbolQuotation({
                        symbol,
                        date: new Date((new Date()).valueOf() + 1000),
                        bid: 1,
                        ask: 3,
                    }),
                }),
                new MidaSymbolTick({
                    quotation: new MidaSymbolQuotation({
                        symbol,
                        date: new Date((new Date()).valueOf() + 2000),
                        bid: 2,
                        ask: 4,
                    }),
                }),
            ];

            await account.loadTicks(ticks);

            const accountTicks: MidaSymbolTick[] = await account.getSymbolTicks(symbol);

            expect(accountTicks.length).toBe(ticks.length);

            for (let i: number = 0; i < ticks.length; ++i) {
                expect(accountTicks[i].equals(ticks[i])).toBe(true);
            }
        });

        it("sorts added ticks from oldest to newest", async () => {
            const account: PlaygroundBrokerAccount = await broker.login();
            const symbol: string = "TEST";
            const ticks: MidaSymbolTick[] = [
                new MidaSymbolTick({
                    quotation: new MidaSymbolQuotation({
                        symbol,
                        date: new Date(),
                        bid: 0,
                        ask: 0,
                    }),
                }),
                new MidaSymbolTick({
                    quotation: new MidaSymbolQuotation({
                        symbol,
                        date: new Date((new Date()).valueOf() + 1000),
                        bid: 1,
                        ask: 3,
                    }),
                }),
                new MidaSymbolTick({
                    quotation: new MidaSymbolQuotation({
                        symbol,
                        date: new Date((new Date()).valueOf() - 2000),
                        bid: 2,
                        ask: 4,
                    }),
                }),
                new MidaSymbolTick({
                    quotation: new MidaSymbolQuotation({
                        symbol,
                        date: new Date((new Date()).valueOf() + 3000),
                        bid: 1,
                        ask: 3,
                    }),
                }),
            ];

            await account.loadTicks(ticks);

            const accountTicks: MidaSymbolTick[] = await account.getSymbolTicks(symbol);

            expect(accountTicks.length).toBe(ticks.length);

            ticks.sort((a: MidaSymbolTick, b: MidaSymbolTick) => a.date.valueOf() - b.date.valueOf());

            for (let i: number = 0; i < ticks.length; ++i) {
                expect(accountTicks[i].equals(ticks[i])).toBe(true);
            }
        });

        /*
        it("correctly adds ticks multiple times to the same symbol", async () => {
            const account: PlaygroundBrokerAccount = await broker.login();
            const ticks: MidaSymbolTick[] = [
                new MidaSymbolTick({
                    quotation: new MidaSymbolQuotation({
                        symbol: "TEST",
                        date: new Date(),
                        bid: 200,
                        ask: 200,
                    }),
                }),
            ];

            await account.loadTicks(ticks);

            const accountTicks: MidaSymbolTick[] = await account.getSymbolTicks("TEST");

            expect(accountTicks.length).toBe(ticks.length);

            for (let i: number = 0; i < ticks.length; ++i) {
                expect(accountTicks[i].equals(ticks[i])).toBe(true);
            }
        });*/
    });

    describe(".deposit", () => {
        it("correctly increases balance", async () => {
            const initialBalance: number = 10000;
            const account: PlaygroundBrokerAccount = await broker.login({
                balance: initialBalance,
            });

            account.deposit(initialBalance);

            expect(await account.getBalance()).toBe(initialBalance * 2);

            account.deposit(initialBalance / 3);

            expect(await account.getBalance()).toBe(initialBalance * 2 + initialBalance / 3);
        });
    });

    describe(".withdraw", () => {
        it("correctly decreases balance", async () => {
            const initialBalance: number = 10000;
            const account: PlaygroundBrokerAccount = await broker.login({
                balance: initialBalance,
            });

            account.withdraw(initialBalance);

            expect(await account.getBalance()).toBe(0);

            account.withdraw(initialBalance / 3);

            expect(await account.getBalance()).toBe(initialBalance / 3 * -1);
        });
    });
});
