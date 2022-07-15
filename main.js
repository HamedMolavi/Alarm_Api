let time = [0, 0, 0];
let timreVar;
let audioVar;
let audioFlag = true;
let audio = new Audio('alarm.mp3');
let myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
    keyboard: false
});
let myModalEl = document.getElementById('exampleModal');


$('#select').change(function (e) {
    e.preventDefault();
    if ($('#select').val() === 'custom') $('#collapse').removeClass('collapse');
    else $('#collapse').addClass('collapse');

    if ($('#select').val() !== 'Time selection' && $('#select').val() !== 'custom') {
        $('#timer').text(`00:${$('#select').val()}:00`);
        time = [0, parseInt($('#select').val()), 0];
        $('#start').removeAttr('disabled');
    }
    else {
        clearTime();
    }
});

$('#submit').click(function () {
    secs = $('#inpS').val();
    mins = $('#inpM').val();
    hrs = $('#inpH').val();
    let check = parseInt(secs) === parseFloat(secs) & parseInt(mins) === parseFloat(mins) & parseInt(hrs) === parseFloat(hrs);
    if (
        parseInt(secs) > 0 & !isNaN(parseInt(mins)) & !isNaN(parseInt(hrs)) & parseInt(secs) < 60 & parseInt(mins) < 60 & check |
        !isNaN(parseInt(secs)) & parseInt(mins) > 0 & !isNaN(parseInt(hrs)) & parseInt(mins) < 60 & parseInt(secs) < 60 & check |
        !isNaN(parseInt(secs)) & !isNaN(parseInt(mins)) & parseInt(hrs) > 0 & parseInt(secs) < 60 & parseInt(mins) < 60 & check
    ) {
        if (secs.length === 1) secs = '0'.concat(secs);
        if (mins.length === 1) mins = '0'.concat(mins);
        if (hrs.length === 1) hrs = '0'.concat(hrs);
        $('#timer').text(`${hrs}:${mins}:${secs}`)
        $('#start').removeAttr('disabled');
        time[0] = parseInt($('#timer').text().slice(0, 2));
        time[1] = parseInt($('#timer').text().slice(3, 5));
        time[2] = parseInt($('#timer').text().slice(6));
    } else {
        alert("wrong input !!");
        clearTime();
    }

});

$('#start').click(function (e) {
    clickBtns(e.target.id);
});

$('#cancel').click(function (e) {
    clickBtns(e.target.id);
    clearTime();
    $('#hideByStart').removeClass('collapse');
    $('#select').val('Time selection');
});
$('#sound').click(function (e) {
    $('#sound').toggleClass('btn-outline-dark');
    $('#sound').toggleClass('btn-outline-success');
    $('#sound > i').toggleClass('fa-volume-off');
    $('#sound > i').toggleClass('fa-volume-up');
    if (audioFlag) audioFlag = false;
    else audioFlag = true;
});






function clearTime() {
    $('#inpS').val('0');
    $('#inpM').val('0');
    $('#inpH').val('0');
    time = [0, 0, 0];
    $('#timer').text(`00:00:00`);
    $('#start').attr('disabled', "");
    $('#cancel').attr('disabled', "");
}

function clickBtns(id) {
    if (id === 'start') {
        $('#cancel').removeAttr('disabled');
        $('#start').text("Pause");
        $('#start').addClass("btn-danger");
        $('#start').attr('id', "pause");
        $('#hideByStart').addClass('collapse');
        timreVar = setInterval(myTimer, 1000);
    } else if (id === 'pause') {
        $('#pause').text("Resume");
        $('#pause').removeClass("btn-danger");
        $('#pause').addClass("btn-info");
        $('#pause').attr('id', "resume");
        clearInterval(timreVar);
    } else if (id === 'resume') {
        $('#resume').text("Pause");
        $('#resume').removeClass("btn-info");
        $('#resume').addClass("btn-danger");
        $('#resume').attr('id', "pause");
        timreVar = setInterval(myTimer, 1000);
    } else if (id === 'cancel') {
        $('#pause').add('#resume').attr('id', "start");
        $('#start').text("Start");
        $('#start').removeClass("btn-danger");
        $('#start').removeClass("btn-info");
        clearInterval(timreVar);
    }
}

function myTimer() {
    if (time[2] > 0) {
        time[2]--;
        if (time[2].toString().length === 1) $('#timer').text($('#timer').text().slice(0, 6).concat('0'.concat(time[2])));
        else $('#timer').text($('#timer').text().slice(0, 6).concat(''.concat(time[2])));
    } else if (time[1] > 0) {
        time[1]--;
        time[2] = 59;
        if (time[1].toString().length === 1) $('#timer').text(
            $('#timer').text().slice(0, 3).concat('0'.concat(time[1])).concat(':59')
        );
        else $('#timer').text(
            $('#timer').text().slice(0, 3).concat(''.concat(time[1])).concat(':59')
        );
    } else if (time[0] > 0) {
        time[0]--;
        time[1] = 59;
        time[2] = 59;
        if (time[0].toString().length === 1) $('#timer').text(
            '0'.concat(time[0]).concat(':59:59')
        );
        else $('#timer').text(
            ''.concat(time[0]).concat(':59:59')
        );
    }
    else {
        clearInterval(timreVar);
        clickBtns('cancel');
        clearTime();
        $('#hideByStart').removeClass('collapse');
        if (audioFlag) {
            audioVar = setInterval(() => audio.play(), 0);
            $('.modal-body > p').text("Time is Up! Close this message to stop alarm.");
            myModalEl.addEventListener('hide.bs.modal', function (event) {
                clearInterval(audioVar);
            });
        } else {
            $('.modal-body > p').text("Time is Up!");
        }

        myModal.toggle();
    }

}