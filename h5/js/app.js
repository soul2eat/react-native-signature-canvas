const content = `
    var wrapper = document.getElementById("signature-pad"),
        clearButton = wrapper.querySelector("[data-action=clear]"),
        saveButton = wrapper.querySelector("[data-action=save]"),
        canvas = wrapper.querySelector("canvas"),
        signaturePad;
    // Adjust canvas coordinate space taking into account pixel ratio,
    // to make it look crisp on mobile devices.
    // This also causes canvas to be cleared.
    function resizeCanvas() {
        // When zoomed out to less than 100%, for some very strange reason,
        // some browsers report devicePixelRatio as less than 1
        // and only part of the canvas is cleared then.
        var ratio =  Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
    }
    
    window.onresize = resizeCanvas;
    resizeCanvas();
    
    signaturePad = new SignaturePad(canvas);
    
    function contextEv(ev){
        if(ev === 'isEmpty'){
            if(signaturePad.isEmpty())
                wMess('{"action": "isEmpty", "value": true}')
            else
                wMess('{"action": "isEmpty", "value": false}')
        }
        if(ev === 'getImage'){
            if(signaturePad.isEmpty())
                wMess('{"action": "getImage"}')
            else
                wMess('{"action": "getImage", "value": "' + signaturePad.toDataURL() +'"}')
        }
        if(ev === 'clear)
            signaturePad.clear();
    }

    function wMess(ev){
        window.ReactNativeWebView.postMessage(ev);
    }
`;

export default content;