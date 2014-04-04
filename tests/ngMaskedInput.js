// describe("Masked Input", function () {

//     beforeEach(function () {
//         module("ngMaskedInput");
//     });

//     describe("Directive: Masked Input", function () {
//         var $compile;
//         var $scope;
//         var $httpBackend;

//         beforeEach(inject(function(_$compile_, _$rootScope_) {
//             $compile = _$compile_;
//             $scope = _$rootScope_.$new();
//         }));

//         it("should render the header and text as passed in by $scope", inject(function() {
//             var template = $compile("<input type=\"text\" ng-model=\"input\" mask=\"(99) 9999-9999\" />")($scope);

//             $scope.input = "aaa";
//             $scope.$digest();
//             template[0].blur()
//             debugger;

//             var templateAsHtml = template.html();

//             expect(templateAsHtml).toContain($scope.input);

//         }));
//     });
// });