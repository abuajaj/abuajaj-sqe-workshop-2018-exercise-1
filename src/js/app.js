/* eslint-disable complexity */
import $ from 'jquery';
import Parser from './parser';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {

        let codeToParse = $('#codePlaceholder').val();

        let parser = new Parser(codeToParse);
        parser.build();
        $('#table-result tbody').html(parser.render());
    });
});
