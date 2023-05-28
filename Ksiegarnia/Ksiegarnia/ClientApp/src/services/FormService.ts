class FormService {

    public requiredMessage = "Pole nie może być puste"
    public invalidFormatMessage = "Niepoprawny format"
    public passwordFormatMessage = "Min. 8 znaków, min. 1 mała litera, min. 1 duża litera, min. 1 cyfra, min. 1 znak specjalny"

    checkIfIsRequired(input?: string){
        return input && input !== ""
    }

    checkIfIsEmail(input: string){
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(input);
    }

    checkPassword(input: string){
        const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/
        return re.test(input);
    }

    checkIfIsAdult(input: Date){
        const actualDate: Date = new Date()
        const diff = actualDate.getTime() - input.getTime()
        const diffDate = new Date(diff)

        return diffDate.getUTCFullYear() - 1970 >= 18
    }
}

export default new FormService;