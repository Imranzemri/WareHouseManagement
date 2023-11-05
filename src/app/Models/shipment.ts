import { JsonProperty } from 'json2typescript';

export class Shipment {

    constructor() {}
        @JsonProperty('Name', String)

        public Name: string = '';

       

        @JsonProperty('ShptNmbr', String)

        public ShptNmbr: string = '';

        @JsonProperty('Length', Number)
        public Length: number | number = 0;
        @JsonProperty('Width', Number)
        public Width: number | number = 0;
        @JsonProperty('Height', Number)
        public Height: number | number=0;
       

        @JsonProperty('Dmnsn', Number)

        public Dmnsn: number | null = null;

       

        @JsonProperty('Wght', Number)

        public Wght: number | number = 0;

       

        @JsonProperty('Locn', String)

        public Locn: string | null = null;

       

        @JsonProperty('Note', String)

        public Note: string | null = null;

       

        @JsonProperty('Imgs', String)

        public Imgs: string | null = null;

       

        @JsonProperty('Rpnt', String)

        public Rpnt: string | null = null;

       

        @JsonProperty('CstmRpnt', String)

        public CstmRpnt: string | null = null;

       

        @JsonProperty('Qnty', Number)

        public Qnty: number | null = null;

       

 

   

}