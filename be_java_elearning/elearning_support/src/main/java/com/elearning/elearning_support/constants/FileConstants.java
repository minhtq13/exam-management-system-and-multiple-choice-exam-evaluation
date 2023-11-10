package com.elearning.elearning_support.constants;

public class FileConstants {

    public static final String[] EXTENSIONS = new String[]{
        Extension.Image.JPG,
        Extension.Image.JPEG,
        Extension.Image.PNG,
        Extension.Image.WEBP,
        Extension.Excel.XLS,
        Extension.Excel.XLSX,
        Extension.PortableDocumentFormat.PDF,
        Extension.Word.DOCX,
        Extension.Word.DOC,
        Extension.PowerPoint.PPT,
        Extension.PowerPoint.PPTX
    };

    public static class Extension {

        private Extension() {
        }

        public static class Excel {

            public static final String XLSX = "XLSX";
            public static final String XLS = "XLS";

            private Excel() {
            }
        }

        public static class Word {

            public static final String DOCX = "DOCX";
            public static final String DOC = "DOC";

            private Word() {
            }
        }

        public static class PortableDocumentFormat {

            public static final String PDF = "PDF";

            private PortableDocumentFormat() {
            }
        }

        public static class PowerPoint {

            public static final String PPT = "PPT";
            public static final String PPTX = "PPTX";

            private PowerPoint() {
            }
        }

        public static class Image {

            public static final String PNG = "PNG";
            public static final String GIF = "GIF";
            public static final String JPEG = "JPEG";
            public static final String JPG = "JPG";
            public static final String TIFF = "TIFF";
            public static final String JFIF = "JFIF";
            public static final String ICO = "ICO";
            public static final String WEBP = "WEBP";

            private Image() {
            }
        }

        public static class Video {

            public static final String MKV = "MKV";
            public static final String FLV = "FLV";
            public static final String AVI = "AVI";
            public static final String MP4 = "MP4";
            public static final String MOV = "MOV";
            public static final String WMV = "WMV";
            public static final String VOB = "VOB";

            private Video() {
            }

        }


    }

}
