import { faker } from "@faker-js/faker";
import { Account, AccountIdType, createRandomAccount } from "./Account";
import { Role } from "./Role";

export enum TypeOfCargoHandlePoint {
    Transaction,
    Assembly,
}

export type CargoHandlePointIdType = string;

export interface CargoHandlePoint {
    _id: CargoHandlePointIdType;
    name: string;
    type: TypeOfCargoHandlePoint;
    pointAdmin: AccountIdType;
    pointEmployees: AccountIdType[];
    associatedAssemblyPoint?: CargoHandlePointIdType;
}

export function CreateRandomPointAndAllAccounts(
    adminRole: Role,
    dutyArea: string,
    employeeNumber: number,
    associatedAssemblyPoint?: CargoHandlePointIdType
): [CargoHandlePoint, Account, Account[]] {
    const [_id, employeeRole, type] =
        adminRole == Role.AssemblyAdmin
            ? [
                  `tk-${faker.string.nanoid()}`,
                  Role.AssemblyPointEmployee,
                  TypeOfCargoHandlePoint.Assembly,
              ]
            : [
                  `gd-${faker.string.nanoid()}`,
                  Role.TransactionPointEmployee,
                  TypeOfCargoHandlePoint.Transaction,
              ];

    const admin = createRandomAccount(adminRole);

    const employees = Array.from(
        {
            length: faker.helpers.rangeToNumber({
                min: 3,
                max: employeeNumber,
            }),
        },
        () => createRandomAccount(employeeRole)
    );

    const pointEmployees = employees.map((emp) => emp._id);

    return [
        {
            _id,
            type,
            name: dutyArea,
            pointAdmin: admin._id,
            pointEmployees,
            associatedAssemblyPoint,
        },
        admin,
        employees,
    ];
}
