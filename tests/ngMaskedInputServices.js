describe("Masked Input", function () {

    "use strict";

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
            "ngModel": "input"
        };
        ctrl = {
            "$modelValue": undefined,
            "$viewValue": ""
        };
    });

    describe("Factory: Masked Input Object", function () {

        it("should return a object", inject(function (MaskedInput) {
            expect(MaskedInput).toBeDefined();
        }));

        it("should insert underscores on input text", inject(
            function (MaskedInput) {
                MaskedInput.getNewViewValue("1", elem, attrs, ctrl);
                expect(elem.val()).toBe("(1_) ____-____");
                expect(elem[0].selectionStart).toBe(2);
            }
        ));

        it("should replace the next blank field to user input data", inject(
            function (MaskedInput) {
                elem[0].selectionStart = 3;
                MaskedInput.getNewViewValue("(11_) ____-____", elem, attrs, ctrl);
                expect(elem.val()).toBe("(11) ____-____");
                expect(elem[0].selectionStart).toBe(5);

                elem[0].selectionStart = 7;
                MaskedInput.getNewViewValue("(11) 11___-____", elem, attrs, ctrl);
                expect(elem.val()).toBe("(11) 11__-____");
                expect(elem[0].selectionStart).toBe(7);
            }
        ));

        it("move the input to the correct blank field if the next is static", inject(
            function (MaskedInput) {
                elem[0].selectionStart = 4;
                MaskedInput.getNewViewValue("(111) ____-____", elem, attrs, ctrl);
                expect(elem.val()).toBe("(11) 1___-____");
                expect(elem[0].selectionStart).toBe(6);

                elem[0].selectionStart = 10;
                MaskedInput.getNewViewValue("(11) 11111-____", elem, attrs, ctrl);
                expect(elem.val()).toBe("(11) 1111-1___");
                expect(elem[0].selectionStart).toBe(11);
            }
        ));

        it("should meet the length limit rules", inject(
            function(MaskedInput) {
                elem[0].selectionStart = 16;
                MaskedInput.getNewViewValue("(111) 1111-11111", elem, attrs, ctrl);
                expect(elem.val()).toBe("(11) 1111-1111");
                expect(elem[0].selectionStart).toBe(16);
            }
        ));

        it("should delete (delete buttom) the correct character ignoring the mask", inject(
            function (MaskedInput) {
                MaskedInput.userOperation = 46;  // Delete key code
                elem[0].selectionStart = 3;
                MaskedInput.getNewViewValue("(11 1___-____", elem, attrs, ctrl);
                expect(elem.val()).toBe("(11) ____-____");
                expect(elem[0].selectionStart).toBe(3);
                expect(MaskedInput.userOperation).toBeUndefined();

                MaskedInput.userOperation = 46;  // Delete key code
                elem[0].selectionStart = 9;
                MaskedInput.getNewViewValue("(11) 11111___", elem, attrs, ctrl);
                expect(elem.val()).toBe("(11) 1111-____");
                expect(elem[0].selectionStart).toBe(9);
                expect(MaskedInput.userOperation).toBeUndefined();
            }
        ));

        it("should delete (backspace buttom) the correct character ignoring the mask", inject(
            function (MaskedInput) {
                MaskedInput.userOperation = 8;  // Backspace key code
                elem[0].selectionStart = 4;
                MaskedInput.getNewViewValue("(11)1___-____", elem, attrs, ctrl);
                expect(elem.val()).toBe("(11) ____-____");
                expect(elem[0].selectionStart).toBe(3);
                expect(MaskedInput.userOperation).toBeUndefined();

                MaskedInput.userOperation = 8;  // Backspace key code
                elem[0].selectionStart = 9;
                MaskedInput.getNewViewValue("(11) 1111____", elem, attrs, ctrl);
                expect(elem.val()).toBe("(11) 111_-____");
                expect(elem[0].selectionStart).toBe(8);
                expect(MaskedInput.userOperation).toBeUndefined();
            }
        ));

        it("elem.val() and $viewValue need be actualized", inject(
            function (MaskedInput) {
                MaskedInput.getNewViewValue("1", elem, attrs, ctrl);
                expect(elem.val()).toBe("(1_) ____-____");
                expect(ctrl.$viewValue).toBe("(1_) ____-____");
            }
        ));
    });
});