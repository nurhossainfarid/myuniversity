export type TSemesterName = "Spring" | "Summer" | "Fall"
export type TSemesterCode = "01" | "02" | "03"
export type TMonths =   | "January"
| "February"
| "March"
| "April"
| "May"
| "June"
| "July"
| "August"
| "September"
| "October"
| "November"
| "December"

export type TAcademicSemesterNameCodeMapper = {
    [key: string]: string
}


export type TAcademicSemester = {
    name: TSemesterName,
    year:  string,
    code: TSemesterCode,
    startMonth: TMonths,
    endMonth: TMonths
}