import os

filepath = r"r:\Projects\MiraPay\apps\mirapay-frontend\src\app\pages\clients\client-detail\client-detail.html"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    '← Retour aux clients': "{{ ts.translate('CLIENTS.DETAILS.BACK') }}",
    '+ Ajouter Contact': "{{ ts.translate('CLIENTS.DETAILS.ADD_CONTACT') }}",
    "+ Ajouter Banque d'Heures": "{{ ts.translate('CLIENTS.DETAILS.ADD_BANK') }}",
    '<h2>Informations Générales</h2>': "<h2>{{ ts.translate('CLIENTS.DETAILS.GENERAL_INFO') }}</h2>",
    '<strong>Courriel :</strong>': "<strong>{{ ts.translate('CLIENTS.DETAILS.EMAIL') }}</strong>",
    '<strong>Téléphone :</strong>': "<strong>{{ ts.translate('CLIENTS.DETAILS.PHONE') }}</strong>",
    '<strong>Adresse :</strong>': "<strong>{{ ts.translate('CLIENTS.DETAILS.ADDRESS') }}</strong>",
    '<strong>Dévise :</strong>': "<strong>{{ ts.translate('CLIENTS.DETAILS.CURRENCY') }}</strong>",
    '<h2>Contacts ({{ client()?.contacts?.length || 0 }})</h2>': "<h2>{{ ts.translate('CLIENTS.DETAILS.CONTACTS') }} ({{ client()?.contacts?.length || 0 }})</h2>",
    'Aucun contact défini.': "{{ ts.translate('CLIENTS.DETAILS.NO_CONTACTS') }}",
    '<h2>Banques d\'Heures</h2>': "<h2>{{ ts.translate('CLIENTS.DETAILS.BANK_HOURS') }}</h2>",
    "{{ bank.estActive ? 'Active' : 'Inactive' }}": "{{ bank.estActive ? ts.translate('CLIENTS.DETAILS.ACTIVE') : ts.translate('CLIENTS.DETAILS.INACTIVE') }}",
    "{{ bank.description || 'Pas de description' }}": "{{ bank.description || ts.translate('CLIENTS.DETAILS.NO_DESCRIPTION') }}",
    "<span>Solde: ": "<span>{{ ts.translate('CLIENTS.DETAILS.BALANCE') }} ",
    'Aucune banque d\'heures définie pour ce client.': "{{ ts.translate('CLIENTS.DETAILS.NO_BANK_HOURS') }}",
    
    # Modal Bank
    '<h2>Ajouter une Banque d\'Heures</h2>': "<h2>{{ ts.translate('CLIENTS.DETAILS.MODAL_BANK_TITLE') }}</h2>",
    '<label for="bankName">Nom de la banque *</label>': '<label for="bankName">{{ ts.translate(\'CLIENTS.DETAILS.MODAL_BANK_NAME\') }}</label>',
    '<label for="bankDesc">Description</label>': '<label for="bankDesc">{{ ts.translate(\'CLIENTS.DETAILS.MODAL_BANK_DESC\') }}</label>',
    '<label for="bankHours">Heures Achetées *</label>': '<label for="bankHours">{{ ts.translate(\'CLIENTS.DETAILS.MODAL_BANK_HOURS\') }}</label>',
    '<label for="dateDebut">Date Début</label>': '<label for="dateDebut">{{ ts.translate(\'CLIENTS.DETAILS.MODAL_BANK_START\') }}</label>',
    '<label for="dateFin">Date Fin</label>': '<label for="dateFin">{{ ts.translate(\'CLIENTS.DETAILS.MODAL_BANK_END\') }}</label>',
    '(click)="closeModal()">Annuler</button>': '(click)="closeModal()">{{ ts.translate(\'CLIENTS.CANCEL\') }}</button>',
    '[disabled]="bankForm.invalid">Enregistrer</button>': '[disabled]="bankForm.invalid">{{ ts.translate(\'CLIENTS.SAVE\') }}</button>',

    # Modal Contact
    '<h2>Ajouter un Contact</h2>': "<h2>{{ ts.translate('CLIENTS.DETAILS.MODAL_CONTACT_TITLE') }}</h2>",
    '<label for="contactNom">Nom Complet *</label>': '<label for="contactNom">{{ ts.translate(\'CLIENTS.DETAILS.MODAL_CONTACT_NAME\') }}</label>',
    '<label for="contactFonction">Fonction / Rôle</label>': '<label for="contactFonction">{{ ts.translate(\'CLIENTS.DETAILS.MODAL_CONTACT_ROLE\') }}</label>',
    '<label for="contactEmail">Courriel</label>': '<label for="contactEmail">{{ ts.translate(\'CLIENTS.DETAILS.EMAIL\') }}</label>',
    '<label for="contactTel">Téléphone</label>': '<label for="contactTel">{{ ts.translate(\'CLIENTS.DETAILS.PHONE\') }}</label>',
    '(click)="closeContactModal()">Annuler</button>': '(click)="closeContactModal()">{{ ts.translate(\'CLIENTS.CANCEL\') }}</button>',
    '[disabled]="contactForm.invalid">Enregistrer</button>': '[disabled]="contactForm.invalid">{{ ts.translate(\'CLIENTS.SAVE\') }}</button>'
}

worked_count = 0
for old_text, new_text in replacements.items():
    if old_text in content:
        content = content.replace(old_text, new_text)
        worked_count += 1
    else:
        print(f"Warning: '{old_text}' not found in content.")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Replacement complete. Worked: {worked_count}/{len(replacements)}")
