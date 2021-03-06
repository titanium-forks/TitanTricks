
TitanTricks.ui.createImageResizer = {};

(function(){
	
	//media will be usually the event.media object returned by openPhotoGallery
	//but any image with properties width and height would work
	TitanTricks.ui.createImageResizer = function(/*media object*/ media) {
		
		var media = media || {};
		
		var tmpImage = Ti.UI.createImageView();
		tmpImage.image = media;
		
		var imgW = media.width || 0;
		var imgH = media.height || 0;
		
		if(!imgW || !imgH){
			Ti.API.error('CAUTION: invalid media size: ' + imgW + ' x ' + imgH);
		}
		
		//default values
		var MAX_WIDTH = media.maxWidth || 400;
		var MAX_HEIGHT = media.maxHeight || 400;
		
		if (imgW > imgH){
			//landscape
			if(imgW > MAX_WIDTH){
				imgH = imgH / (imgW / MAX_WIDTH);
				imgW = MAX_WIDTH;
			}
			if(imgH > MAX_HEIGHT){
				imgW = imgW / (imgH / MAX_HEIGHT);
				imgH = MAX_HEIGHT;
			}	
		}else{
			//portrait or square
			if(imgH > MAX_HEIGHT){
				imgW = imgW / (imgH / MAX_HEIGHT);
				imgH = MAX_HEIGHT;
				
			}
			if(imgW > MAX_WIDTH){
				imgH = imgH / (imgW / MAX_WIDTH);
				imgW = MAX_WIDTH;
			}		
		}
		
		imgW = parseInt(imgW);
		imgH = parseInt(imgH);
		
		tmpImage.width = imgW;
		tmpImage.height = imgH;
		
		media.newWidth = imgW;
		media.newHeight = imgH;
		
		//new nice functions for image object. If you resize an image you will probably want to 
		//send by email or save, aren't you?

		/*tmpImage.sendMail = function(args){
			var args = args || {};
			args.subject = args.subject || '';
			args.attachment = args.attachment || '';
			var file = tmpImage.savePhoto();
			var emailDialog = Titanium.UI.createEmailDialog()
			emailDialog.subject = args.subject;
			emailDialog.addAttachment();
			emailDialog.open();
		};*/
		
		//To review. If image is not saved, there is no was(!?) to attach the image resized (the original will be attached instead)
		tmpImage.sendMail = function(args){
			var args = args || {};
			args.subject = args.subject || '';
			args.attachment = args.attachment || '';
			var filename = Titanium.Filesystem.applicationDataDirectory+Titanium.Filesystem.separator + 'TitanTricks_' + imgW + 'x' + imgH + '.jpg';
			
			var theImage = tmpImage.toImage();
			
			var file = Titanium.Filesystem.getFile(filename);
			file.write(theImage); 
			
			Titanium.Media.saveToPhotoGallery(file, {
				success: function(event){
					var emailDialog = Titanium.UI.createEmailDialog();
					emailDialog.subject = args.subject;
					emailDialog.addAttachment(file);
					emailDialog.open();
				},
				error: function(err){
					var a = Titanium.UI.createAlertDialog({
						title: App.config.name
					});
					a.setMessage('Unexpected error. ' + filename);
					a.show();
				}
			}); 
		};


		return tmpImage; //tmpImage.toImage();
		
	};
	
})();
