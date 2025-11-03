    import { Injectable } from '@nestjs/common';
    import * as bcrypt from 'bcrypt';

    @Injectable()
    export class BcryptService {
    

    
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, await bcrypt.genSalt());
    }

    
    async compare(password: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(password, hashed);
    }
    }
