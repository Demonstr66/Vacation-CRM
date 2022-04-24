export const inputRules = {
  data: () => ({
    blankCheck: v => !!v || 'Обязательное поле',
    emailCheck: (value) => {
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value) || "Некорректный e-mail.";
    },
    min5char: (value) => (value && value.length >= 5) || `Минимум 5 символов`,
  })
}