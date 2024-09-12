export default class REGEX_VALIDATORS {
    public static REGEX_PASSWORD =
        /^(?=.*[a-zàáèéìíòóùúñ])(?=.*[A-ZÀÁÈÉÌÍÒÓÙÚÑ])(?=.*\d)(?=.*[@$¡!%*;,.?&#=_-])[A-Za-z\dàáèéìíòóùúñÀÁÈÉÌÍÒÓÙÚÑ@$¡!%*;,.?&#=_-]{8,16}$/;
}