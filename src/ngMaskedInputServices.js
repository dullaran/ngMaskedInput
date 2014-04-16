var ngMaskedInputServices = angular.module("ngMaskedInputServices", []);

function MaskedInputClass () {
    "use strict";

    this.validChars = ["A", "9", "*"];

    /*
     * Search in mask the first valid position
     *
     * @param {String} string
     */
    this.findFirstIndex = function (string) {
        var positions = [
                string.indexOf("A"),
                string.indexOf("9"),
                string.indexOf("*")
            ].sort();

        var lastUnfound = positions.lastIndexOf(-1);

        if (lastUnfound !== -1) {
            return positions[lastUnfound + 1];
        }

        return positions[0];
    };

    /*
     * Search in mask the last valid position
     *
     * @param {String} string
     */
    this.findLastIndex = function (string) {
        var positions = [
                string.lastIndexOf("A"),
                string.lastIndexOf("9"),
                string.lastIndexOf("*")
            ].sort().reverse();

        return positions[0];
    };

    /*
     * When the User deletes a character of mask we need modify the
     * input, deleting the correct character. This function returns the
     * modified view.
     *
     * @param {viewValue} string
     * @param {Object} attrs
     */
    this.getViewValueAfterOperation = function (viewValue, attrs) {
        if (this.validChars.indexOf(attrs.mask[this.cursor]) === -1){
            if (this.userOperation === 46) { // Delete key code
                this.flux = 2;
                viewValue =
                    viewValue.substring(0, this.cursor) +
                    viewValue.substring(
                        this.cursor +
                        this.findFirstIndex(
                            attrs.mask.substring(this.cursor))
                    );
            } else {                        // Backspace
                viewValue =
                    viewValue.substring(0,
                        this.findLastIndex(
                            attrs.mask.substring(0, this.cursor))) +
                    viewValue.substring(this.cursor);
            }
        }
        if (this.userOperation === 8) {      // Backspace key code
            this.flux = 3;
        }
        this.userOperation = undefined;
        return viewValue;
    };

    /*
     * After changes input value the cursor is assigned to last position
     * of input, this function puts him to correct position
     *
     * @param {Object} elem
     * @param {Object} attrs
     * @param {String} newViewValue
     */
    this.setcursor = function (elem, attrs, newViewValue) {
        var position;
        /*
         * this.flux is the code of procedure realized by function:
         * - 0 user data is invalid
         * - 1 is First insert of data
         * - 2 is Delete operation
         * - 3 is Backspace operation
         * - 4 is Normal Flux
         */
        switch (this.flux) {
            case 0:
                position = this.cursor - 1;
                break;
            case 1:
                position = this.findFirstIndex(attrs.mask) + 1;
                break;
            case 2:
                position = this.cursor;
                break;
            case 3:
                position =
                    this.findLastIndex(attrs.mask.substring(0, this.cursor + 1));
                // Position can be a different of valid field for user
                if (newViewValue[position] !== "_") {
                    position++;
                }
                break;
            default:
                // Last position of input
                if (attrs.mask[this.cursor] === undefined){
                    position = this.cursor;
                // If position is different of valid field for user
                } else if (this.validChars.indexOf(attrs.mask[this.cursor]) ===
                         -1) {
                    var newCursor = this.cursor +
                            this.findFirstIndex(
                                attrs.mask.substring(this.cursor));
                    if (newViewValue[newCursor] !== "_" &&
                            newViewValue[newCursor] !== undefined) {
                        position = newCursor + 1;
                    } else {
                        position = newCursor;
                    }
                } else {
                    if (this.validChars.indexOf(attrs.mask[this.cursor - 1]) === -1 &&
                            newViewValue[this.cursor] !== undefined) {
                        position = this.cursor + 1;
                    } else {
                        position = this.cursor;
                    }
                }
        }
        this.flux = undefined;
        elem[0].selectionEnd = elem[0].selectionStart = position;
    };

    /*
     * Main function, checks the data inserted by user and defines the
     * element value to it
     *
     * @param {string} viewValue
     * @param {Object} elem
     * @param {Object} attrs
     * @param {Object} ctrl
     */
    this.getNewViewValue = function (viewValue, elem, attrs, ctrl) {
        var newViewValue;
        this.cursor = elem[0].selectionStart;
        var template = attrs.mask.replace(new RegExp("[A9*]", "g"), "_");

        if (viewValue.length === 1) {
            this.flux = 1;
        }

        if (this.userOperation !== undefined) {
            viewValue = this.getViewValueAfterOperation(viewValue, attrs);
        }

        var userInput = viewValue.replace(/[\W_]/gi, "");
        newViewValue = template;
        for (var i = 0; i < userInput.length; i++) {
            if (attrs.mask[newViewValue.indexOf("_")] === "9") {
                if (!Boolean(parseInt(userInput[i]))) {
                    this.flux = 0;
                    continue;
                }
            } else if (attrs.mask[newViewValue.indexOf("_")] === "A") {
                if (Boolean(parseInt(userInput[i]))) {
                    this.flux = 0;
                    continue;
                }
            }
            newViewValue = newViewValue.replace("_", userInput[i]);
        }

        if (newViewValue === template) {
             elem.val("");
            ctrl.$viewValue = "";
        } else {
            elem.val(newViewValue);
            this.setcursor(elem, attrs, newViewValue);
            ctrl.$viewValue = newViewValue;
        }

        return "";
    };
}

ngMaskedInputServices.factory("MaskedInput", function MaskedInput() {
    "use strict";

    return new MaskedInputClass();
});