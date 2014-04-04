describe("Masked Input", function () {

    var elem, attrs, ctrl;

    beforeEach(function () {
        module("ngMaskedInputServices");
        elem = {
            "0": {
                "selectionStart": 0,
                "selectionEnd": 0
            },
            "texto": "",
            "val": function (valor) {
                if (valor === undefined) {
                    return this.texto;
                }
                this.texto = valor;
            }
        };
        attrs = {
            "mask": "(99) 9999-9999",
            "ngPattern": "/^\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}$/",
            "ngModel": "input"
        };
        ctrl = {
            "$modelValue": undefined,
            "$viewValue": ""
        };
    });

    describe("Factory: Masked Input Object", function () {

        it("deve retornar um objeto", inject(function (MaskedInput) {
            expect(MaskedInput).toBeDefined();
        }));

        it("deve adicionar os sublinhados no input", inject(function (MaskedInput) {
            MaskedInput.getNewViewValue("1", elem, attrs, ctrl)
            expect(elem.val()).toBe("(1_) ____-____");
            expect(elem[0].selectionStart).toBe(2);
        }));

        it("substitui o proximo espaço em branco pelo dado inserido", inject(function (MaskedInput) {
            elem[0].selectionStart = 3
            MaskedInput.getNewViewValue("(11_) ____-____", elem, attrs, ctrl)
            expect(elem.val()).toBe("(11) ____-____");
            expect(elem[0].selectionStart).toBe(5);

            elem[0].selectionStart = 7
            MaskedInput.getNewViewValue("(11) 11___-____", elem, attrs, ctrl)
            expect(elem.val()).toBe("(11) 11__-____");
            expect(elem[0].selectionStart).toBe(7);
        }));

        it("move o dado inserido para o proximo espaco em branco quando houver bloqueio", inject(function (MaskedInput) {
            elem[0].selectionStart = 4
            MaskedInput.getNewViewValue("(111) ____-____", elem, attrs, ctrl)
            expect(elem.val()).toBe("(11) 1___-____");
            expect(elem[0].selectionStart).toBe(6);

            elem[0].selectionStart = 10
            MaskedInput.getNewViewValue("(11) 11111-____", elem, attrs, ctrl)
            expect(elem.val()).toBe("(11) 1111-1___");
            expect(elem[0].selectionStart).toBe(11);
        }));

        it("não deixa inserir mais dados depois do limite", inject(function(MaskedInput) {
            elem[0].selectionStart = 16
            MaskedInput.getNewViewValue("(111) 1111-11111", elem, attrs, ctrl)
            expect(elem.val()).toBe("(11) 1111-1111");
            expect(elem[0].selectionStart).toBe(16);
        }));

        it("delecao de dados inseridos com delete quando haver bloqueio", inject(function (MaskedInput) {
            MaskedInput.userOperation = 46  // Delete key code
            elem[0].selectionStart = 3
            MaskedInput.getNewViewValue("(11 1___-____", elem, attrs, ctrl)
            expect(elem.val()).toBe("(11) ____-____");
            expect(elem[0].selectionStart).toBe(3);
            expect(MaskedInput.userOperation).toBeUndefined();

            MaskedInput.userOperation = 46  // Delete key code
            elem[0].selectionStart = 9
            MaskedInput.getNewViewValue("(11) 11111___", elem, attrs, ctrl)
            expect(elem.val()).toBe("(11) 1111-____");
            expect(elem[0].selectionStart).toBe(9);
            expect(MaskedInput.userOperation).toBeUndefined();
        }))

        it("delecao de dados inseridos com backspace quando haver bloqueio", inject(function (MaskedInput) {
            MaskedInput.userOperation = 8  // Backspace key code
            elem[0].selectionStart = 4
            MaskedInput.getNewViewValue("(11)1___-____", elem, attrs, ctrl)
            expect(elem.val()).toBe("(11) ____-____");
            expect(elem[0].selectionStart).toBe(3);
            expect(MaskedInput.userOperation).toBeUndefined();

            MaskedInput.userOperation = 8  // Backspace key code
            elem[0].selectionStart = 9
            MaskedInput.getNewViewValue("(11) 1111____", elem, attrs, ctrl)
            expect(elem.val()).toBe("(11) 111_-____");
            expect(elem[0].selectionStart).toBe(8);
            expect(MaskedInput.userOperation).toBeUndefined();
        }))

        it("após a mudança de valor tanto o elem.val() quando $viewValue precisam estar atualizados", inject(function (MaskedInput) {
            MaskedInput.getNewViewValue("1", elem, attrs, ctrl);
            expect(elem.val()).toBe("(1_) ____-____");
            expect(ctrl.$viewValue).toBe("(1_) ____-____");
        }))
    });
});