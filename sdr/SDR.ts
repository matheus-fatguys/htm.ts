export interface  SDR{
    n:number,
    w:number,
    activeBits: number[],
    getSparsity():number,
    union(otherSDR:SDR):SDR,
    overlap(otherSDR:SDR):SDR,
    overlapScore(otherSDR:SDR):number,
    concatenate(otherSDR:SDR):SDR
}

export class SDRImpl implements SDR{
    n: number;
    w: number;
    activeBits: number[];

    public constructor(n:number, w:number, activeBits:number[]){
        this.verify(n, w, activeBits)
        this.n=n
        this.w=w
        this.activeBits=activeBits.sort()

    }
    
    public getSparsity(): number {
        return this.w/this.n;
    }

    private verify(n:number, w:number, activeBits:number[]):void{
        if(w>n){
            throw new Error("w:"+w+" must be less than n:"+n);
        }
        
        if(activeBits.length>w){
            throw new Error("active bits must be less than or equal to w:"+w);
        }
        let bit = activeBits.find((bit:number)=>bit>n||bit<0)
        if(bit>=0){
            throw new Error("bit "+bit+" out of bounds [0-"+(n-1))+"]";
        }
    }
    
    public union(otherSDR: SDR): SDR {
        throw new Error("Method not implemented.");
    }

    public overlap(otherSDR: SDR): SDR {
        let bits= this.activeBits
        .map((bit:number) => {
            return otherSDR.activeBits.findIndex((otherBit:number)=>bit===otherBit);
        })
        .filter((bit:number)=>bit<0);
        let n = this.n>otherSDR.n?this.n:otherSDR.n;
        let w = this.n>otherSDR.w?this.n:otherSDR.w;
        return SDRBuilder.build(n, w, bits);

    }

    public overlapScore(otherSDR: SDR): number{
        return this.overlap(otherSDR).activeBits.length;
    }

    public concatenate(otherSDR: SDR): SDR {
        let n = this.n+otherSDR.n
        let w = this.w+otherSDR.w
        let concatenation = this.activeBits.concat(otherSDR.activeBits.map(bit=>bit+this.n));
        return SDRBuilder.build(n, w, concatenation);
    }

}

export class SDRBuilder{
    public static build(n:number, w:number, activeBits:number[]):SDR{
        return new SDRImpl(n, w, activeBits);
    }
}