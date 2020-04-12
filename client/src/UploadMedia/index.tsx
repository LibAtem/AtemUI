import React, { RefObject } from 'react'

import { AtemDeviceInfo } from '../Devices/types'
import { GetActiveDevice, DeviceManagerContext, GetDeviceId } from '../DeviceManager'
import OutsideClickHandler from 'react-outside-click-handler';
import { Container, Table, ButtonGroup, Button, Modal, Form, Row, Col, Navbar, Nav, FormControl, FormControlProps } from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { Switch, Route } from 'react-router';
import { createSecureContext } from 'tls';
import { prettyDecimal } from '../util';
import PropTypes from 'prop-types';
import Slider from 'react-rangeslider';
import { STATUS_CODES } from 'http';


export class UploadMediaPage extends React.Component {
  context!: React.ContextType<typeof DeviceManagerContext>
  
  fileInput = React.createRef() as RefObject<HTMLInputElement>
  static contextType = DeviceManagerContext

  // This function accepts three arguments, the URL of the image to be 
  // converted, the mime type of the Base64 image to be output, and a 
  // callback function that will be called with the data URL as its argument 
  // once processing is complete

  convertToBase64 = function (url: string, imagetype: string, callback: any) {

    var img = document.createElement('IMG') as HTMLImageElement,
      canvas = document.createElement('CANVAS') as HTMLCanvasElement,
      ctx = canvas.getContext('2d'),
      data = '';
    console.log("waaaa")
    // Set the crossOrigin property of the image element to 'Anonymous',
    // allowing us to load images from other domains so long as that domain 
    // has cross-origin headers properly set

    img.crossOrigin = 'Anonymous'
    
    // Because image loading is asynchronous, we define an event listening function that will be called when the image has been loaded
    img.onload = function () {
      console.log("aa12")
      // When the image is loaded, this function is called with the image object as its context or 'this' value
      if (ctx) {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        data = canvas.toDataURL(imagetype);
        callback(data);
      }
    };

    // We set the source of the image tag to start loading its data. We define 
    // the event listener first, so that if the image has already been loaded 
    // on the page or is cached the event listener will still fire

    img.src = url;
    console.log(img)
  };
  onDrop: any;

  // Here we define the function that will send the request to the server. 
  // It will accept the image name, and the base64 data as arguments

  sendBase64ToServer (name: string, base64: string) {
    
    var device = GetActiveDevice(this.context)
    if(device){
      var id = GetDeviceId(device)
    
    var httpPost = new XMLHttpRequest(),
      path = "http://127.0.0.1:5000/api2/"+id+"/"+ name,
      data = JSON.stringify({ image: base64 });
    httpPost.onreadystatechange = function (err) {
      if (httpPost.readyState == 4 && httpPost.status == 200) {
        console.log(httpPost.responseText);
      } else {
        console.log(err);
      }
    };
    // Set the content type of the request to json since that's what's being sent
  
    // httpPost.setHeader('Content-Type', 'application/json');
    httpPost.open("POST", path, true);
    httpPost.setRequestHeader('Content-Type', 'application/json')
    httpPost.send(data);
  }
  };

  // This wrapper function will accept the name of the image, the url, and the 
  // image type and perform the request

  uploadImage(src:string, name:string, type:string) {
    var parentThis=this
 
    this.convertToBase64(src, type, function (data:string) {
      console.log("button Pressed")
      parentThis.sendBase64ToServer(name, data);
      
    });
  };

//   var fileTag = document.getElementById("filetag"),
//   preview = document.getElementById("preview");
    
// fileTag.addEventListener("change", function() {
//   changeImage(this);
// });

changeImage(input:any) {
  var reader;
  var parentThis = this
  console.log(input)
  if (input.files && input.files[0]) {
    reader = new FileReader();

    reader.onload = function(e:any) {
      var result = e.originalTarget.result 
      if(result){
        console.log(result)
        parentThis.sendBase64ToServer("Test",result)
      }
      // console.log(result.readAsDataURL())
      // parentThis.sendBase64ToServer("Test",e.originalTarget.result)
    }

    reader.readAsDataURL(input.files[0]);
  }
}

  // Call the function with the provided values. The mime type could also be png
  // or webp

  //uploadImage(imgsrc, name, 'image/jpeg')
 /* <button onClick={()=>this.uploadImage("/img1.png", "image", 'image/jpeg')}>UP</button> */
  render() {
    const device = GetActiveDevice(this.context)

    return (
      <Container>

        {device ? (
          <div>
           <input onChange={(e)=>this.changeImage(e.currentTarget)}type="file" id="filetag"></input>
           <img src="" id="preview"></img>
           </div>
        ) : (
            <p>No device selected</p>
          )}
      </Container>
    )
  }
}

