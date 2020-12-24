import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";

// Represents the parameters of the broker order constructor.
export type MidaBrokerOrderParameters = {
    ticket: number;
    brokerAccount: MidaBrokerAccount;
    directives: MidaBrokerOrderDirectives;
    requestDate: Date;
    openDate: Date;
};
