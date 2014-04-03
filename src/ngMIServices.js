var ngMaskedInputServices = angular.module("ngMaskedInputServices", []);

function MaskedInputClass () {

    "use strict";

    // this.operation;
    // this.fail;
    // this.newValue;
    // this.userInput;
    // this.cursorPosition;
    // this.template;

    this.findPosition = function (string, type) {
        var positions = [];

        if (type === 2) {
            positions.push(
                string.lastIndexOf("A"),
                string.lastIndexOf("9"),
                string.lastIndexOf("*"));
        } else {
            positions.push(
                string.indexOf("A"),
                string.indexOf("9"),
                string.indexOf("*"));
        }

        positions.sort();

        if (positions.lastIndexOf(-1) !== -1) {
            positions.splice(0, positions.lastIndexOf(-1) + 1);
        }

        if (type === 2) {
            return positions[positions.length - 1];
        } else {
            return positions[0];
        }
    };

    this.getViewValueAfterOperation = function (attrs, viewValue) {
        var charAtMask = attrs.mask[this.cursorPosition],
            position;
        if (["A", "9", "*"].indexOf(charAtMask) === -1) {
            if (this.operation === 8) {
                position = this.findPosition(
                    attrs.mask.substring(0, this.cursorPosition), 2);
                viewValue = viewValue.substring(0, position) +
                    viewValue.substring(position + 1);
            } else {
                position = this.findPosition(
                    attrs.mask.substring(this.cursorPosition), 1);
                if (position !== 0){
                    viewValue = viewValue.substring(
                        0, position + this.cursorPosition - 1) +
                    viewValue.substring(position + this.cursorPosition);
                }
            }
        }
        return viewValue;
    };

    this.setCursorPosition = function (elem, attrs) {
        var finalPosition;
        if (this.fail){
            elem[0].selectionStart = this.cursorPosition - 1;
            elem[0].selectionEnd = this.cursorPosition - 1;
        } else if (this.userInput.length === 1) {
            finalPosition = this.findPosition(attrs.mask, 1);
            elem[0].selectionStart = finalPosition + 1;
            elem[0].selectionEnd = finalPosition + 1;
        } else if (this.newValue[this.cursorPosition] === attrs.mask[this.cursorPosition] &&
                attrs.mask[this.cursorPosition] !== undefined) {
            if (this.operation === 8) {
                elem[0].selectionStart =
                    this.newValue.substring(0, this.cursorPosition).indexOf("_");
                elem[0].selectionEnd =
                    this.newValue.substring(0, this.cursorPosition).indexOf("_");
            } else if (this.operation === 46) {
                elem[0].selectionStart = this.cursorPosition;
                elem[0].selectionEnd = this.cursorPosition;
            } else {
                finalPosition =
                    this.findPosition(attrs.mask.substring(this.cursorPosition), 1);
                elem[0].selectionStart = finalPosition + this.cursorPosition;
                elem[0].selectionEnd = finalPosition + this.cursorPosition;
            }
        } else {
            elem[0].selectionStart = this.cursorPosition;
            elem[0].selectionEnd = this.cursorPosition;
        }
    };

    this.getNewViewValue = function (viewValue, elem, attrs, ctrl) {
        this.cursorPosition = elem[0].selectionStart;
        this.template = attrs.mask.replace(new RegExp("[A9*]", "g"), "_");
        this.newValue = this.template;

        if (this.operation) {
            viewValue = this.getViewValueAfterOperation(attrs, viewValue);
        }

        this.userInput = viewValue.replace(/[\W_]/gi, "");
        for (var i = 0; i < this.userInput.length; i++) {
            if (attrs.mask[this.newValue.indexOf("_")] === "9") {
                if (parseInt(this.userInput[i]) < 0) {
                    this.fail = true;
                    continue;
                }
            } else if (attrs.mask[this.newValue.indexOf("_")] === "A") {
                if (parseInt(this.userInput[i]) >= 0) {
                    this.fail = true;
                    continue;
                }
            }
            this.newValue = this.newValue.replace("_", this.userInput[i]);
        }

        if (this.newValue === this.template) {
            this.newValue = "";
        }

        elem.val(this.newValue);
        ctrl.$viewValue = this.newValue;

        this.setCursorPosition(elem, attrs);
        this.operation = undefined;
        return this.newValue;
    };
}

ngMaskedInputServices.factory("MaskedInput", function MaskedInput() {
    "use strict";
    return new MaskedInputClass();
});