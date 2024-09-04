import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}
    async getAllUsers(): Promise<User[]>{
        return await this.userRepository.find();
    }
    async createUser (userData: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(userData);
        return await this.userRepository.save(newUser);
    }

    async updateUser(id: number, userData: Partial<User>): Promise<User>{
        await this.userRepository.update(id, userData);
        return this.userRepository.findOne({where: {id}});
    }
    async deleteUser(id: number): Promise<void>{
        await this.userRepository.delete(id);
    }
}