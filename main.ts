import inquirer from 'inquirer';

class Account {
    private balance: number;

    constructor(private accountHolder: string, initialBalance: number = 0) {
        this.balance = initialBalance;
    }

    deposit(amount: number): void {
        this.balance += amount;
        console.log(`Deposited $${amount}. New balance is $${this.balance}.`);
    }

    withdraw(amount: number): void {
        if (amount > this.balance) {
            console.log(`Insufficient funds. Current balance is $${this.balance}.`);
        } else {
            this.balance -= amount;
            console.log(`Withdrew $${amount}. New balance is $${this.balance}.`);
        }
    }

    getBalance(): number {
        return this.balance;
    }

    getAccountHolder(): string {
        return this.accountHolder;
    }
}

class MyBank {
    private accounts: Account[] = [];

    createAccount(accountHolder: string, initialBalance: number): void {
        const account = new Account(accountHolder, initialBalance);
        this.accounts.push(account);
        console.log(`Account for ${accountHolder} created with initial balance $${initialBalance}.`);
    }

    findAccount(accountHolder: string): Account | undefined {
        return this.accounts.find(account => account.getAccountHolder() === accountHolder);
    }

    async start(): Promise<void> {
        while (true) {
            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'Choose an action:',
                    choices: ['Create Account', 'Deposit', 'Withdraw', 'Check Balance', 'Exit'],
                },
            ]);

            switch (answers.action) {
                case 'Create Account':
                    const { holder, balance } = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'holder',
                            message: 'Enter account holder name:',
                        },
                        {
                            type: 'input',
                            name: 'balance',
                            message: 'Enter initial balance:',
                            validate: (input) => !isNaN(parseFloat(input)) && parseFloat(input) >= 0,
                        },
                    ]);
                    this.createAccount(holder, parseFloat(balance));
                    break;

                case 'Deposit':
                    const depositAnswers = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'holder',
                            message: 'Enter account holder name:',
                        },
                        {
                            type: 'input',
                            name: 'amount',
                            message: 'Enter amount to deposit:',
                            validate: (input) => !isNaN(parseFloat(input)) && parseFloat(input) > 0,
                        },
                    ]);
                    const depositAccount = this.findAccount(depositAnswers.holder);
                    if (depositAccount) {
                        depositAccount.deposit(parseFloat(depositAnswers.amount));
                    } else {
                        console.log(`Account for ${depositAnswers.holder} not found.`);
                    }
                    break;

                case 'Withdraw':
                    const withdrawAnswers = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'holder',
                            message: 'Enter account holder name:',
                        },
                        {
                            type: 'input',
                            name: 'amount',
                            message: 'Enter amount to withdraw:',
                            validate: (input) => !isNaN(parseFloat(input)) && parseFloat(input) > 0,
                        },
                    ]);
                    const withdrawAccount = this.findAccount(withdrawAnswers.holder);
                    if (withdrawAccount) {
                        withdrawAccount.withdraw(parseFloat(withdrawAnswers.amount));
                    } else {
                        console.log(`Account for ${withdrawAnswers.holder} not found.`);
                    }
                    break;

                case 'Check Balance':
                    const balanceAnswers = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'holder',
                            message: 'Enter account holder name:',
                        },
                    ]);
                    const balanceAccount = this.findAccount(balanceAnswers.holder);
                    if (balanceAccount) {
                        console.log(`Current balance for ${balanceAnswers.holder} is $${balanceAccount.getBalance()}.`);
                    } else {
                        console.log(`Account for ${balanceAnswers.holder} not found.`);
                    }
                    break;

                case 'Exit':
                    console.log('Goodbye!');
                    return;

                default:
                    console.log('Unknown action.');
            }
        }
    }
}

const myBank = new MyBank();
myBank.start();
