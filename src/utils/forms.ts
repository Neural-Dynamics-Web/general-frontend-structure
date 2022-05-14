export const fieldBlur = (validation:any, $externalResults:any ,field:string):void => {
    validation[field].$touch()
    delete $externalResults[field]
}

export function objToOptions(param:any) {
    return Object.keys(param)
    .filter((value:string | number) => isNaN(Number(value)) === false)
    .reduce(
        (o:object, key:string) => ({
                ...o,
                [key]: param[key],
            }),
        {}
    )
}