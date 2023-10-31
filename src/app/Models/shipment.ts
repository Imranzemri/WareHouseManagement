import { JsonProperty } from 'json2typescript';

export class Shipment {

    constructor() {}
        @JsonProperty('Name', String)

        public Name: string = '';

       

        @JsonProperty('ShptNmbr', String)

        public ShptNmbr: string = '';

       

        @JsonProperty('Dmnsn', String)

        public Dmnsn: string | null = null;

       

        @JsonProperty('Wght', String)

        public Wght: string | null = null;

       

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