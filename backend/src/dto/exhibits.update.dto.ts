import { IsOptional, IsString } from "class-validator";

export class ExhibitsUpdateDto {
    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    subtitle?: string;
}