import { faker } from "@faker-js/faker";
import { CargoHandlePointIdType } from "./CargoHandlePoint";
import {
    Customer,
    CustomerIdType,
    assignReceiveOrderToCustomer,
    assingSentOrderToCustomer,
} from "./Customer";
import { Cargo, CargoIdType, CreateRandomCargo } from "./Cargo";
import { MAX_CARGO_QUANTITY, MIN_CARGO_QUANTITY } from "../constant";

export type OrderIdType = string;

export interface Order {
    _id: OrderIdType;
    cargoList: CargoIdType[];
    sentPoint: CargoHandlePointIdType;
    sentCustomer: CustomerIdType;
    sentDate: Date;
    receivePoint: CargoHandlePointIdType;
    receiveCustomer: CustomerIdType;
    receivedDate: Date;
    cost: number;
}

function createRandomOrder(
    cargoHandlePoints: CargoHandlePointIdType[],
    customers: CustomerIdType[],
    maxReceiveDate: Date,
    cargoList: Cargo[]
): Order {
    const [sentPoint, receivePoint] = faker.helpers.arrayElements(
        cargoHandlePoints,
        2
    );

    const [sentCustomer, receiveCustomer] = faker.helpers.arrayElements(
        customers,
        2
    );

    const sentDate = faker.date.past();

    const receivedDate = faker.date.between({
        from: sentDate,
        to: maxReceiveDate,
    });

    const cargoNumber = faker.helpers.rangeToNumber({ min: 1, max: 4 });
    const currentOrderCargoList = Array.from({ length: cargoNumber }, () =>
        CreateRandomCargo(MIN_CARGO_QUANTITY, MAX_CARGO_QUANTITY)
    );
    cargoList.push(...currentOrderCargoList);

    return {
        _id: faker.string.nanoid(),
        cargoList: currentOrderCargoList.map((cargo) => cargo._id),
        sentPoint,
        sentCustomer,
        sentDate,
        receivePoint,
        receiveCustomer,
        receivedDate,
        cost: 0,
    };
}

export function createRandomOrders(
    numberOfOrders: number,
    cargoHandlePoints: CargoHandlePointIdType[],
    customers: Customer[],
    maxReceiveDate: Date,
    cargoList: Cargo[]
): Order[] {
    return Array.from({ length: numberOfOrders }, () => {
        const order = createRandomOrder(
            cargoHandlePoints,
            customers.map((customer) => customer.profile.ssn),
            maxReceiveDate,
            cargoList
        );

        assingSentOrderToCustomer(customers, order.sentCustomer, order._id);
        assignReceiveOrderToCustomer(
            customers,
            order.receiveCustomer,
            order._id
        );

        return order;
    });
}
