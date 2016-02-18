/*
     This script generate one pdf file for the Biggest Artboard in the illustration (ai, eps).
       
    This script was created by Olimpiu Hulea.
    
    For any questions or inquieries, bugs, feel free to contact me.
    Contact: (+31)0657976413
                    olimpiu@maruboshi.nl  / olimpiu_hulea@yahoo.ro
*/

#target illustrator-19

var theFolder = Folder.selectDialog ("Select a folder");

if (theFolder != null) {
    forEachDescendantFile(theFolder, doStuffIfDocument)
    }

function doStuff(document) {
        docRef = document.name;
        //$.writeln("Found document: " + docRef);
        //$.writeln("Folder path: " + theFolder);
        newDoc = theFolder + "/" + docRef.substr(0, docRef.lastIndexOf(".")) + ".pdf";
        //$.writeln("The new document: " + newDoc);
        saveFileToPDF(newDoc);
    }

function saveFileToPDF (dest) {
    var doc = app.activeDocument;
    var na = doc.artboards.length; // number of artboards in the document
    $.writeln('Art Num:' + na);
    var bigA = findBiggestAB (na);
    $.writeln("Biggest Artboard Range" + bigA);
    var range = (bigA.range+1).toString();
    $.writeln('Range:' + range);
    
    if ( app.documents.length > 0 ) {
        var saveName = new File ( dest );
        saveOpts = new PDFSaveOptions();
        saveOpts.compatibility = PDFCompatibility.ACROBAT5;
        saveOpts.generateThumbnails = true;
        saveOpts.preserveEditability = false;
        saveOpts.saveMultipleArtboards = true;
        saveOpts.artboardRange = range;
        
        doc.saveAs( saveName, saveOpts );
    }
}

//Open file, the call doStuff().
function doStuffIfDocument(oFile) {
    if ((matchExtension (oFile, 'ai')) || (matchExtension (oFile, 'eps'))) { // process .ai or .eps files
        var document = app.open(oFile);
        try {
                doStuff(document);
            }
        finally {
                document.close(SaveOptions.YES);
            }
    }
}

function forEachDescendantFile(folder, callback) {
    var aChildren = folder.getFiles();
    for (var i = 0; i < aChildren.length; i++) {
        var child = aChildren[i];
        if (child instanceof File) {
            callback(child);
        }
        else if (child instanceof Folder) {
            this.forEachDescendantFile(child, callback);
        }
        else {
            throw new Error("The object at \"" + child.fullName + "\" is a child of a folder and yet is not a file or folder.");
        }
    }
}

function matchExtension(iFile, sExtension) {
    sExtension = "." + sExtension.toLowerCase();
    var displayName = iFile.displayName.toLowerCase();
    if (displayName.length < sExtension.length) {
        return false;
        }
    return displayName.slice(-sExtension.length) === sExtension;
    }

function findBiggestAB() {
        var doc = app.activeDocument;
        var na = doc.artboards.length; // number of artboards in the document
        $.writeln('Number of artboards: ' + na);

        var AB = {}, arr = [];
        for (i = 0; i < na; i++) {
            artboard = doc.artboards[i]; // set active artboard
            ArtName = artboard.name; // get artboard name
            
            // calculate width of artboard
            ArtRect = artboard.artboardRect; // get rectangle of the artboard
            //$.writeln(ArtRect);
            width = Math.round(ArtRect[2]) - Math.round(ArtRect[0]);
            
            AB.name = ArtName;
            AB.width = width;
            
            $.writeln(AB.name + ' ___ ' +  AB.width + ' px');
            arr.push({name: AB.name, width: AB.width, range: i}); // proper way to insert the object in array.
            }

        //sort the array based on the width
        var sortedArray = arr.sort(function(a,b) {
                return parseFloat(a.width) - parseFloat(b.width);
            });

        //show last element of the array
        biggestArtBoard = sortedArray.slice(-1)[0];
        $.writeln('The biggest ArtBoard is ' + biggestArtBoard.name + '. It has ' + biggestArtBoard.width + 'px.');
        return biggestArtBoard;
    };