import { faker } from "@faker-js/faker";

export type CargoIdType = string;

export enum CargoType {
    Essential = "Đồ ăn, thức uống, y tế, giáo dục",
    Common = "Tivi , tủ lạnh, máy giặt, điều hòa, điện thoại, laptop",
}

/**
 * weight (Kg)
 */
export interface Cargo {
    _id: CargoIdType;
    name: string;
    quantity: number;
    weight: number;
}

export function CreateRandomCargo(
    minQuantity: number,
    maxQuantity: number
): Cargo {
    return {
        _id: faker.string.nanoid(),
        name: faker.helpers.enumValue(CargoType),
        quantity: faker.helpers.rangeToNumber({
            min: minQuantity,
            max: maxQuantity,
        }),
        weight: faker.helpers.rangeToNumber(100),
    };
}
